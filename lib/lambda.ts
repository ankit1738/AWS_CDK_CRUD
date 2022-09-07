import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { Architecture, Runtime } from "aws-cdk-lib/aws-lambda";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct, Node } from "constructs";
import * as path from "path";

export class Lambda extends NodejsFunction {
  constructor(scope: Construct, fileName: string) {
    super(scope, fileName, {
      architecture: Architecture.ARM_64,
      runtime: Runtime.NODEJS_14_X,
      entry: path.join(__dirname, `../backend/lambda/${fileName}.ts`),
    });

    this.addToRolePolicy(
      new PolicyStatement({
        resources: ["*"],
        actions: ["dynamodb:*"],
      })
    );
  }
}
