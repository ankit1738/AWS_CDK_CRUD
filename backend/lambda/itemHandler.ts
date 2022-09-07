import { APIGatewayEvent } from "aws-lambda";
import { DynamoDB } from "aws-sdk";

interface ApiError {
  statusCode: number;
  message: string;
}
export const handler = async (event: APIGatewayEvent) => {
  try {
    const dynamo = new DynamoDB.DocumentClient({ region: "ap-south-1" });

    console.log("Inside item handler: ", event);

    let result: any = {
      statusCode: 200,
      body: "OK",
    };
    const method: string = event.httpMethod;
    const path: string = event.resource;
    const pathParameters: any = event.pathParameters;
    const body: any =
      typeof event.body == "object" ? event.body : JSON.parse(event.body);

    switch (method) {
      //move GET to constant
      case "GET": {
        if (path == "/items") {
          const data = await dynamo
            .scan({
              TableName: "ItemDB",
            })
            .promise();
          console.log(data.Items);
          result.items = data.Items;
        }

        if (path == "/items/{itemId}") {
          console.log(pathParameters.itemId);
          var params = {
            KeyConditionExpression: "id = :id",
            ExpressionAttributeValues: {
              ":id": Number(pathParameters.itemId),
            },
            TableName: "ItemDB",
          };
          const data = await dynamo.query(params).promise();
          console.log("One item here", data);
          result.item = data.Items;
        }
        break;
      }
      case "POST": {
        if (path == "/items/addItem") {
          console.log(body);

          let params = {
            TableName: "ItemDB",
            Key: { id: Number(body.itemId) },
            UpdateExpression: "set #n = :name, #r = :rating ",
            ExpressionAttributeValues: {
              ":name": body.name,
              ":rating": Number(body.rating),
            },
            ExpressionAttributeNames: {
              "#n": "name",
              "#r": "rating",
            },
          };
          await dynamo.update(params).promise();
        }
      }
      case "PUT": {
        if (path == "/items/updateItem") {
          console.log(body);
          let updateExpression = "set ";
          let expressionAttributeNames: any = {};
          let expressionAttributeValues: any = {};
          let addSeperator: boolean = false;

          if (!body.id) {
            return {
              statusCode: 400,
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                success: false,
                message: "Item id missing",
              }),
            };
          }

          //move this to util file and return params
          //make a function top return params. iterate over all the keys and create this params expr;
          if (body.name) {
            for (const property in body) {
              if (property == "id") continue;
              updateExpression += ` #${property} = :${property} ,`;
              expressionAttributeNames["#" + property] = property;
              expressionAttributeValues[":" + property] = body[property];
            }

            updateExpression = updateExpression.slice(0, -1);

            const params = {
              TableName: "ItemDB",
              Key: {
                id: body.id,
              },
              ConditionExpression: "attribute_exists(id)",
              UpdateExpression: updateExpression,
              ExpressionAttributeNames: expressionAttributeNames,
              ExpressionAttributeValues: expressionAttributeValues,
            };

            console.log(
              "Update parameter: ",
              JSON.stringify(params, undefined, 2)
            );

            const uresult = await dynamo.update(params).promise();
            console.log("Update Result: ", uresult);
          }
        }
      }
      case "DELETE": {
        if (path == "/items/deleteItem") {
          const params = {
            Key: {
              id: body.id,
            },
            TableName: "ItemDB",
            ConditionExpression: "attribute_exists(id)",
          };
          console.log("Delete function", JSON.stringify(params, undefined, 2));
          await dynamo.delete(params).promise();
        }
      }
    }

    console.log("This", result);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(result),
    };
  } catch (error) {
    const err = error as ApiError;
    return {
      statusCode: err.statusCode,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sucess: false, message: err.message }),
    };
  }
};
