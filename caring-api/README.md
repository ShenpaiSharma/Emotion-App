## API Endpoints


### POST-- {baseURL}/expression : 

- When a user gets registered or gets authorization it will create a new user in the db with userId, account_id, first_name, last_name, email, start_time, end_time, and expression_array, also passing these as request body. Initially, it will create the Day 1 expression array. 
- Expression_array: It will be an array of arrays with a Day object and on that day it will contain an emotion array generated every second.
- See the use in Face-Detection-App -> [here](https://github.com/ShenpaiSharma/Caring/blob/c18593cb7a4ff0bdb0d0530824df895f392f5f10/caring-app/public/script.js#L69)

Response Status code: 
- 201: User successfully created.
- 403: If a user with the same email id and account_id already exists. {message: 'User already exists'}.
- 500: Internal Server error.

### PUT-- {baseURL}/update/expression :

- For every successful registration or signin it will push the new day emotion array data of every second in the expression_array. For ex: When a user registers it will create a Day 1 emotion array and push it into the expression array and with signin it will push the new day emotion array data into the existing expression array.
- It will take user_id, first_name, email, expression_array as a request body, and use the email to find the user to update.
- See the use in Face-Detection-App: [here](https://github.com/ShenpaiSharma/Caring/blob/c18593cb7a4ff0bdb0d0530824df895f392f5f10/caring-app/public/script.js#L146)

Response Status Code:
- 200: User Successfully updated.  {message: 'Successfully updated the user's emotion'}
- 404: User not found, { message: 'User not found' }
- 500: Internal Server error.

### POST-- {baseURL}/signin :

- This endpoint will help to validate the user, using their email and password. I used this in the Face Detection App to check the validity of the user.
- It will take email and password as a request body. 
- See the use in Face-Detection-App -> [here](https://github.com/ShenpaiSharma/Caring/blob/c18593cb7a4ff0bdb0d0530824df895f392f5f10/caring-app/public/script.js#L107)

Response Status Code: 
- 200: User is valid.
- 404: User is not valid. { message: 'error logging in }
- 500: Internal Server Error

### DELETE-- {baseURL}/delete_user/:id :

- It will delete any user from the database. It will take user_id as request params of the user to be deleted.

Response Status Code: 
- 200: message: 'User Successfully deleted'
- 404: { message: 'User not found' }
- 500: Internal Server Error

### GET-- {baseURL}/expression/average_time/:id?filter

- It will filter the last day's emotion data recorded for every second. For ex: using filter 5 will take the average emotion of every 5 second data and will reduce the extensive clutter produced by each and every second data, also it will try to reduce the load on the dashboard by showing average data according to user needs.
- See the use in Dashboard code here -> [Line Chart](https://github.com/ShenpaiSharma/Caring/blob/c18593cb7a4ff0bdb0d0530824df895f392f5f10/caring-dashboard/src/components/Dashboard/Dashboard.js#L131) and [Pie Chart](https://github.com/ShenpaiSharma/Caring/blob/c18593cb7a4ff0bdb0d0530824df895f392f5f10/caring-dashboard/src/components/Dashboard/Dashboard.js#L75)

Response Status Code: 
- 200: Return the avg_time data
- 404: When user_id does not match. ({ message: 'User not found' }
- 500: Internal Server Error

### GET-- {baseURL}/expression/average_day/:id?from&to

- Return user’s average daily emotion data. We can filter according to which day to what day we need average emotion score data.
- See the use in Dashboard code here -> [Line Chart](https://github.com/ShenpaiSharma/Caring/blob/c18593cb7a4ff0bdb0d0530824df895f392f5f10/caring-dashboard/src/components/Dashboard/Dashboard.js#L229)

Response Status Code: 
- 200: Return the average_day data
- 404: When user_id does not match. ({ message: 'User not found' }
- 500: Internal Server Error

### GET-- {baseURL}/valence/average_day/:id?from&to

- Return user’s average daily valence score data. We can filter according to which day to what day we need average valence score data.
- See the use Dashboard here -> [Line Chart](https://github.com/ShenpaiSharma/Caring/blob/c18593cb7a4ff0bdb0d0530824df895f392f5f10/caring-dashboard/src/components/Dashboard/Dashboard.js#L322)

Response Status Code: 
- 200: Return the average_day data
- 404: When user_id does not match. ({ message: 'User not found' }
- 500: Internal Server Error




## Usage

### Deployment

This example is made to work with the Serverless Framework dashboard, which includes advanced features such as CI/CD, monitoring, metrics, etc.

In order to deploy with dashboard, you need to first login with:

```
serverless login
```

install dependencies with:

```
npm install
```

and then perform deployment with:

```
serverless deploy
```

### Local development

It is also possible to emulate API Gateway and Lambda locally by using `serverless-offline` plugin. In order to do that, execute the following command:

```bash
serverless plugin install -n serverless-offline
```

It will add the `serverless-offline` plugin to `devDependencies` in `package.json` file as well as will add it to `plugins` in `serverless.yml`.

After installation, you can start local emulation with:

```
serverless offline
```

To learn more about the capabilities of `serverless-offline`, please refer to its [GitHub repository](https://github.com/dherault/serverless-offline).
