# API:
### Get Employee list / Get employee
- sortKey = id - why do we need to have both fields? ID should be enough to avoid duplicity. Same with username and partitionKey.
- We should not show salary in the GET request as it's sensitive info, better to have a separate endpoint for that
- for "benefitsCost" and "net" we don't need to show values with so many decimal places, we can show max 2 decimals

### GET employee
- if I provide non-existing ID, server return 200 instead of 404
- if I provide invalid ID format (p.e. 123) server returns 500 with HTML - inconsistent with the rest of error handling
- get deleted employee - server returns 200 with empty body, but should be 404 

### Add new employee 
- to improve status code, better would be to return 201 - Created instead of 200 - OK
- you can set your own expiration date which should not be allowed

### Update Employee 
- for existing employee I can modify his salary which I should not be able to do
	- I can also set a negative value for salary - it's not being properly handled as in dependants field
- If I provide non-existing ID / deleted ID in the body, new employee is created with randomly generated ID - it should throw a 404 error instead since we use POST to create new entry.
- If I don't provide dependants field in the request - I would expect it to stay the same, instead it is set to 0. Or make the field mandatory?
- it's possible to update expiration date - should not be allowed --> it's returned in the response but when doing the GET request, the expiration date is not modified
- Better would be using PATCH instead of PUT?
- 


### Delete employee
- better would be to return 204 status code since the response's body is empty
- if I provide non-existing ID, server returns 200 - should be 404?


### Other
Nitpick:
I was curious because my text editor kept highlighting the word "dependants" as incorrect, so here's what Perplexity says about it:

*"Dependants" is a correct word, but its usage depends on the context and regional spelling preferences:*

1. *In British English:*  
    *"Dependants" is the correct plural form of "dependant," which is a noun referring to people who rely on someone else for financial support*
    
2. *In American English:*  
    *"Dependants" is not typically used. Instead, Americans use "dependents" for both the noun and adjective forms*

As the majority of clients are US-based, better to have the spelling "dependents"