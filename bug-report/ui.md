# UI bugs report

I will create a full report with all the required fields and steps to reproduce for what I think are the most serious bugs. For the other ones, as it's a demo project, I will just provide a summary which should be hopefully clear enough.

## Full report

### 001. XSS triggered for firstname / lastname input
**Summary**: XSS triggered when input unsanitized for firstname / lastname. This is a serious security issue.  
**Severity**: High  
**Priority**: High  
**Environment**: prod, chrome (Version 133.0.6943.142)  
**Steps to reproduce:**  
1. Click Add Employee button / or Edit existing one  
2. In the modal window input this string either for First Name or Last Name  
     `<img src="aaa" onerror="alert(11)"/>`  
3. Click Save / Update  

**Expected:** input is sanitized, no script should be executed  
**Actual:** input is evaluated a JS command, script is executed - see the screenshot below  
**Screenshot / video:**  
![XSS triggered](<../assets/images/xss-triggered.png>)  
**Additional info:** when I tried with input `<script>alert('11')</script>` no alert got triggered so there's already some sanitizing in place  

______

### 002. It's possible to format the input string, add image
**Summary**: It's possible to format string for firstname / lastname or add an image. Input should be sanitized and displayed as plain text or just ignored. Instead it's evaluated as valid HTML code.
**Severity**: Medium  
**Priority**: Medium  
**Environment**: prod, chrome (Version 133.0.6943.142)  
**Steps to reproduce:**  
1. Click Add Employee button / or Edit existing one  
2. In the modal window input some of these strings either for First Name or Last Name  
     `name <img src="https://shorturl.at/WLOS9" />`  NOTE: provide a valid URL for image, if it's too long, use some shortener
     `<strong>john</strong>`  
     `<h1 style="color: red; font-size: 40px;">Hi</h1>`

3. Click Save / Update  

**Expected:** input is sanitized and displayed as plain text or just ignored  
**Actual:** input is evaluated as valid html and rendered accordingly  
**Screenshot / video:**   
![image rendered](<../assets/images/image-rendered.png>)  
![input formatted](<../assets/images/input-formatted.png>)  

__________

## High-level overview of UI bugs & suggestions for improvement

**Login** 
- when I input invalid credentials on login, I receive 405 status, page frozen. Reloading does not help. I have to reopen the page in new tab


**Logout** 
- when I click Logout then click on back button in browser, table with list of employees is still there. I should be redirected to login screen instead or some error page displayed. Currently it looks like I can add / edit employee but upon save the server returns 403.

**Edit employee**
- when I input invalid Dependent value (-1 or 33) and click Update --> no error message on the UI, only error message in the 400 response --> user would have to be an advanced user with network tab open. This check can also be done on the UI so we don't need to call the server.
- when I try to update employee entry with any of empty field (first name, last name or dependents) --> no error message on the UI, nothing happens. Only 405 returned. These could be handled on the UI and not allow user to send empty values from the UI.
- Modal title has incorrect text - it says `"Add Employee"` but should be `"Edit Employee"`




**Homepage**
- Employees table: Columns `Last name` and `First name` have labels reversed




**Add new employee**
- after Save, it's not easy to find a new entry because it's sorted by randomly generated ID. I would expect the newest employee to be on top / bottom.

**Delete employee**
- click on delete button in actions --> modal window is displayed - as a user I would press ENTER button to confirm deletion, currently not working, nothing happens. However, ESC button works, it closes the modal window



**IMPROVEMENT SUGGESTIONS**
- Salary values should not be shown as it's a sensitive info
- Missing search functionality - p.e. search by ID, search by name, by salary etc.
- Missing pagination where you can also select how many elements to be displayed in view
- Missing sort functionality - p.e. sort by name, by dependents etc. Currently sorted by random ID, better would be by default to sort by modifiedTime / createdTime.
- Missing options to change the display order of columns (p.e. with drag&drop). 
- Missing option to toggle visibility of columns if I'm not interested in them - p.e. having a list of columns with checkboxes for toggling visibility
- Missing filtering functionality - p.e. I want to only see employees with >= 3 dependents <=8
- Missing options to resize column - p.e. ID is too big, I want to make it smaller
- Table header could have a fixed position so when I scroll down I know to which columns the values are corresponding to - now I have to remember it or scroll all the way to the top
- Missing option to select multiple employees and do some actions on them - p.e. delete --> this would require additional endpoint for batch deletion