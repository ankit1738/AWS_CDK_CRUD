#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { CdkPractiseOopStack } from "../lib/cdk_practise_oop-stack";

const app = new cdk.App();
new CdkPractiseOopStack(app, "CdkPractiseOopStack");
