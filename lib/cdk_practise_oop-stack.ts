import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { ApiGateway } from "./apiGateway";
import { Dynamo } from "./dynamo";
import { Lambda } from "./lambda";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkPractiseOopStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const api = new ApiGateway(this);

    const itemLambda = new Lambda(this, "itemHandler");

    new Dynamo(this);

    api.addIntegration("GET", "/items", itemLambda);
    api.addIntegration("GET", "/items/{itemId}", itemLambda);
    api.addIntegration("POST", "/items/addItem", itemLambda);
    api.addIntegration("PUT", "/items/updateItem", itemLambda);
    api.addIntegration("DELETE", "/items/deleteItem", itemLambda);
  }
}
