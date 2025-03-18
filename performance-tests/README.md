# Performance tests challenge

For this part of the challenge I decided to use JMeter.
I've created tests against all 5 endpoints provided.
Exported JMeter file is saved as `.jmx` format. Command to run the test suite in CLI mode (recommended):

`jmeter -n -t path/to/perf-test.jmx -l path/to/log.jtl -e -o path/to/report-folder`

I only put the basic assertions to check the response time - 5s for GET employees list and POST create new employee, 2s for the other requests. Status codes are being checked by default. <br>
I did not want to put more assertions (like checking the response contains proper body) as this is better suited for regular API tests and it would just slow down the execution. Same goes for negative flows.

As it's a test demo, the Authorization header is saved within .jmx file in `HTTP Header Manager`. In real project one of the solution would be passing this value as an argument when running the script and have it stored as a secret variable in the repository.


### Highlights:
POST method when creating new employee: to avoid sending same data in request body, I used randomly generated variable `${UUID()}` for firstname and lastname, and random valid number for dependants `${__Random(1,32)}`

Based on this response I saved employee ID in a variable empID using `JSON Extractor` and used it in subsequent requests for GET, PUT and DELETE.

DELETE Employee - for the last request, in order to clean up the empID variable, I added a simple groovy script using `JSR223 Post Processor`:</br>
`vars.remove("empId");`

### Screenshots
Below are some screenshot when running the whole suite - 10 users over 60 seconds, ramp-up time 10s

<b>Summary report when run in JMeter UI: </b> <br>
642 requests in total, there were some failures for GET employee because the request took almost 3s, similarly for PUT update employee - threshold is 2s
![Summary Report](<../assets/images/perf-tests/summary-report.png>)  

____


<b>HTML Report</b><br>
Below is a screenshot of a generated HTML request when running in CLI mode. As you can notice, there are also some failures for GET and PUT requests as those took more than 2s to execute.
![HTML Report](<../assets/images/perf-tests/html-report.png>)  