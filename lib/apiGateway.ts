import {
  Integration,
  LambdaIntegration,
  ResponseType,
  RestApi,
} from "aws-cdk-lib/aws-apigateway";
import { IFunction } from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";

export class ApiGateway extends RestApi {
  constructor(scope: Construct) {
    super(scope, "ApiGateway", {
      restApiName: "items-api",
    });

    this.addGatewayResponse("invalid-endpoint-error-response", {
      type: ResponseType.MISSING_AUTHENTICATION_TOKEN,
      statusCode: "500",
      responseHeaders: {
        "Access-Control-Allow-Origin": "'*'",
      },
      templates: {
        "application/json":
          '{ "message": "Invalind endpoint", "statusCode": "500", "type": "$context.error.responseType" }',
      },
    });
  }

  addIntegration(method: string, path: string, lambda: IFunction) {
    const resource = this.root.resourceForPath(path);
    resource.addMethod(method, new LambdaIntegration(lambda));
  }
}
