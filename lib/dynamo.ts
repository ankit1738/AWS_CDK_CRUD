import { AttributeType, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";

export class Dynamo extends Table {
  constructor(scope: Construct) {
    super(scope, "DynamoDB", {
      tableName: "ItemDB",
      partitionKey: { name: "id", type: AttributeType.NUMBER },
    });
  }
}
