#  Copyright 2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
#  SPDX-License-Identifier: Apache-2.0

import os
import sys
import io

from aws_cdk import (
    Duration,
    Stack,
    aws_iam as iam,
    aws_lambda as _lambda,
    aws_events as events,
    aws_events_targets as events_targets,
    BundlingOptions
    

)
import aws_cdk as core

# Ask Python interpreter to search for modules in the topmost folder. This is required to access the shared.infrastructure.helpers module
sys.path.append('../../../')

from shared.infrastructure.helpers import common

RUNTIME_SOURCE_DIR = os.path.join(
    os.path.dirname(os.path.dirname(__file__)), os.pardir, 'runtime')


class ChaliceApp(Stack):

    def __init__(self, scope, id, **kwargs):
        super().__init__(scope, id, **kwargs)

        self.mre_workflow_helper_layer = common.MreCdkCommon.get_mre_workflow_helper_layer_from_arn(self)
        self.event_bus = common.MreCdkCommon.get_event_bus(self)

        ### START: EventCompletionHandler LAMBDA ###

        # Role: EventCompletionHandlerLambdaRole
        self.event_completion_handler_role = iam.Role(
            self,
            "EventCompletionHandlerLambdaRole",
            assumed_by=iam.ServicePrincipal("lambda.amazonaws.com")
        )

        # EventCompletionHandlerLambdaRole: CloudWatch Logs permissions
        self.event_completion_handler_role.add_to_policy(
            iam.PolicyStatement(
                effect=iam.Effect.ALLOW,
                actions=[
                    "logs:CreateLogGroup",
                    "logs:CreateLogStream",
                    "logs:PutLogEvents"
                ],
                resources=["*"]
            )
        )

        # EventCompletionHandlerLambdaRole: SSM Parameter Store permissions
        self.event_completion_handler_role.add_to_policy(
            iam.PolicyStatement(
                effect=iam.Effect.ALLOW,
                actions=[
                    "ssm:DescribeParameters",
                    "ssm:GetParameter*"
                ],
                resources=["arn:aws:ssm:*:*:parameter/MRE*"]
            )
        )

        # EventCompletionHandlerLambdaRole: API Gateway Invoke permissions
        self.event_completion_handler_role.add_to_policy(
            iam.PolicyStatement(
                effect=iam.Effect.ALLOW,
                actions=[
                    "execute-api:Invoke",
                    "execute-api:ManageConnections"
                ],
                resources=["arn:aws:execute-api:*:*:*"]
            )
        )

        # EventCompletionHandlerLambdaRole: MediaLive permissions
        self.event_completion_handler_role.add_to_policy(
            iam.PolicyStatement(
                effect=iam.Effect.ALLOW,
                actions=[
                    "medialive:List*",
                    "medialive:Describe*",
                    "medialive:Stop*",
                    "medialive:Start*"
                ],
                resources=["*"]
            )
        )

        self.event_completion_handler_role.add_to_policy(
            iam.PolicyStatement(
                effect=iam.Effect.ALLOW,
                actions=[
                    "scheduler:ListSchedules"
                ],
                resources=[
                    "*"
                ]
            )
        )
        self.event_completion_handler_role.add_to_policy(
            iam.PolicyStatement(
                effect=iam.Effect.ALLOW,
                actions=[
                    "scheduler:DeleteSchedule",
                    "scheduler:GetSchedule"
                ],
                resources=[
                    f"arn:aws:scheduler:*:*:schedule/default/mre*"
                ]
            )
        )

        self.event_completion_handler_role.add_to_policy(
            iam.PolicyStatement(
                effect=iam.Effect.ALLOW,
                actions=[
                    "events:DescribeEventBus",
                    "events:PutEvents"
                ],
                resources=[
                    f"arn:aws:events:*:*:event-bus/{self.event_bus.event_bus_name}"
                ]
            )
        )

        self.environment_config = {
            "EB_EVENT_BUS_NAME": self.event_bus.event_bus_name
        }
        

        # Function: EventCompletionHandler
        self.event_completion_handler_lambda = _lambda.Function(
            self,
            "EventCompletionHandler",
            description="Update the status of an MRE event to Complete based on the configured CloudWatch EventBridge triggers",
            runtime=_lambda.Runtime.PYTHON_3_8,
            code=_lambda.Code.from_asset(f"{RUNTIME_SOURCE_DIR}/lambda"),
            handler="EventCompletion.lambda_handler",
            role=self.event_completion_handler_role,
            memory_size=128,
            timeout=Duration.minutes(1),
            environment=self.environment_config,
            layers=[self.mre_workflow_helper_layer]
        )

        self.channel_stopper_handler_lambda = _lambda.Function(
            self,
            "MediaLiveChannelStopperHandler",
            description="Stops Medialive Channel when a VOD_EVENT_END / LIVE_EVENT_END(Conditions apply) is received via Event Bridge",
            runtime=_lambda.Runtime.PYTHON_3_8,
            code=_lambda.Code.from_asset(f"{RUNTIME_SOURCE_DIR}/lambda"),
            handler="ChannelStopper.lambda_handler",
            role=self.event_completion_handler_role,
            memory_size=128,
            timeout=Duration.minutes(1),
            environment=self.environment_config,
            layers=[self.mre_workflow_helper_layer]
        )

        self.channel_starter_handler_lambda = _lambda.Function(
            self,
            "MediaLiveChannelStarterHandler",
            description="Starts Medialive Channel when a VOD_EVENT_START / LIVE_EVENT_START is received via Event Bridge",
            runtime=_lambda.Runtime.PYTHON_3_8,
            code=_lambda.Code.from_asset(f"{RUNTIME_SOURCE_DIR}/lambda"),
            handler="ChannelStarter.lambda_handler",
            role=self.event_completion_handler_role,
            memory_size=128,
            timeout=Duration.minutes(1),
            environment=self.environment_config
        )

        
        # This Lambda requires the latest boto3 to make calls to EB Schedules API. We use a docker container to package the dependency
        self.schedule_purger_handler_lambda = _lambda.Function(
            self, "SchedulePurgerHandler",
            code=_lambda.Code.from_asset(f"{RUNTIME_SOURCE_DIR}/lambda",
                bundling=BundlingOptions(
                    image=_lambda.Runtime.PYTHON_3_9.bundling_image,
                    command=["bash", "-c", "pip3 install -r requirements.txt -t /asset-output && cp -au . /asset-output"
                    ]
                )
            ),
            description="Deletes a EB Schedule when a VOD_EVENT_COMPLETE / LIVE_EVENT_COMPLETE is received via Event Bridge",
            runtime=_lambda.Runtime.PYTHON_3_9,
            handler="SchedulePurger.lambda_handler",
            role=self.event_completion_handler_role,
            memory_size=128,
            timeout=Duration.minutes(2),
            environment=self.environment_config
        )

        # This Lambda requires the latest boto3 to make calls to EB Schedules API. We use a docker container to package the dependency
        self.schedule_cleanup_cron_lambda = _lambda.Function(
            self,
            "ScheduleCleanupCronHandler",
            description="Deletes older EB schedules. This is a CRON that runs everyday at 6 AM UTC.",
            runtime=_lambda.Runtime.PYTHON_3_8,
            code=_lambda.Code.from_asset(f"{RUNTIME_SOURCE_DIR}/lambda",
                bundling=BundlingOptions(
                    image=_lambda.Runtime.PYTHON_3_9.bundling_image,
                    command=["bash", "-c", "pip3 install -r requirements.txt -t /asset-output && cp -au . /asset-output"
                    ]
                )
            ),
            handler="ScheduleCleanupCron.lambda_handler",
            role=self.event_completion_handler_role,
            memory_size=256,
            timeout=Duration.minutes(15),
            environment=self.environment_config
        )

        ### END: EventCompletionHandler LAMBDA ###

        # EventBridge: MediaLive STOPPED State Change Rule
        self.medialive_eb_rule = events.Rule(
            self,
            "MediaLiveStoppedStateChangeRule",
            description="Rule used by AWS MRE to update the status of an Event to Complete when the MediaLive channel is stopped",
            enabled=True,
            event_pattern=events.EventPattern(
                source=["aws.medialive"],
                detail_type=["MediaLive Channel State Change"],
                detail={
                    "state": ["STOPPED"]
                }
            ),
            targets=[
                events_targets.LambdaFunction(
                    handler=self.event_completion_handler_lambda
                )
            ]
        )

        # Rule that sets up Schedule Cleanup Cron Job to run at 4:00AM every day
        self.schedule_cleanup_cron_rule = events.Rule(self, "ScheduleCleanupCronRule",
            schedule=events.Schedule.cron(
                day="*",
                hour="06",
                minute="00",
                month="*",
                year="*",
                ),
            targets=[events_targets.LambdaFunction(
                    handler=self.schedule_cleanup_cron_lambda
                )],
            description="CRON Rule used by AWS MRE to delete old Event Schedules.",
            enabled=True
        )

        # EventBridge: Schedule Rule VOD_EVENT_END / LIVE_EVENT_END
        self.medialive_eb_schedule_rule = events.Rule(
            self,
            "EventEndEventsRule",
            description="Rule used by AWS MRE to update the status of an Event to Complete when VOD_EVENT_END / LIVE_EVENT_END events are received",
            enabled=True,
            event_bus=self.event_bus,
            event_pattern=events.EventPattern(
                source=["awsmre"],
                detail={
                    "State": ["VOD_EVENT_END", "LIVE_EVENT_END"]
                }
            ),
            targets=[
                events_targets.LambdaFunction(
                    handler=self.channel_stopper_handler_lambda
                ),
                events_targets.LambdaFunction(
                    handler=self.event_completion_handler_lambda
                )
            ]
        )

        # EventBridge: Schedule Rule VOD_EVENT_COMPLETE / LIVE_EVENT_COMPLETE
        self.eb_schedule_deletion_rule = events.Rule(
            self,
            "EventCompleteEventsRule",
            description="Rule used by AWS MRE to delete Schedule(s) when VOD_EVENT_COMPLETE / LIVE_EVENT_COMPLETE events are received",
            enabled=True,
            event_bus=self.event_bus,
            event_pattern=events.EventPattern(
                source=["awsmre"],
                detail={
                    "State": ["VOD_EVENT_COMPLETE", "LIVE_EVENT_COMPLETE"]
                }
            ),
            targets=[
                events_targets.LambdaFunction(
                    handler=self.schedule_purger_handler_lambda
                )
            ]
        )

        # EventBridge: LIVE_EVENT_START
        self.channel_starter_eb_rule = events.Rule(
            self,
            "EventStartEventsRule",
            description="Rule used by AWS MRE to Start processes to consume Video sources based on LIVE_EVENT_START events.",
            enabled=True,
            event_bus=self.event_bus,
            event_pattern=events.EventPattern(
                source=["awsmre"],
                detail={
                    "State": ["LIVE_EVENT_START"]
                }
            ),
            targets=[
                events_targets.LambdaFunction(
                    handler=self.channel_starter_handler_lambda
                )
            ]
        )
