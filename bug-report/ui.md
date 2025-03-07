# UI bugs report

I will create a full report with all the required fields and steps to reproduce for what I think are the most serious bugs. For the other ones, as it's a demo project, I will just provide a summary which should be hopefully clear enough.

### Full report

<details>
<summary>XSS triggered for firstname / lastname input</summary>
Summary: XSS triggered when input unsanitized for firstname / lastname. This is a serious security issue.
Severity: High
Priority: High
Environment: prod, chrome (Version 133.0.6943.142) 
Steps to reproduce:
    1. Click Add Employee button / or Edit existing one
    2. In the modal window input this string either for First Name or Last Name
        - `<img src="aaa" onerror="alert(11)"/>`
    3. Click Save / Update
Expected: input is sanitized, no script should be executed
Actual: input is evaluated a JS command, script is executed - see the screenshot below
Screenshot / video:
![XSS triggered](<../assets/images/xss-triggered.png>)
Additional info: when I tried with input `<script>alert('11')</script>` no alert got triggered so there's already some sanitizing in place

</details>