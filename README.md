Today, our phones are getting smarter. Even our cars will be smart in the years to come. So why not our email service? Would not it be more convenient if our email service can respond without our assistance?

I will show how a simple system, created using Google products (GMail, Google Docs and Google Sheets), can be used to automatically type your standard responses. The code can be easily changed to send the email instead of it saving as draft.

You will be using two types of labels:

Day label: This label is used to schedule the email.
Response label: This label is used to select the template or standard response.
You do not require any prior knowledge of programming. The source code is listed on GitHub for you to use freely and build further. And this is my second objective. Believe me, there is much scope for further improvement.

Let's start.

Step 1 : Go to https://www.google.com/script/start/

Click on Start Scripting. If you have already logged into your Google account, you will directed to Apps Script editor as shown below. If you were not logged in, you will be directed to your login page first.

pic_1

Step 2 : Give a name to the untitled project. Let's say - Create Drafts.

Step 3 : Erase the code on the page and copy the code from GitHub (CreateNewDraft). You will need to replace your name (see line 151 of code), your email address (see line 156 of code) and Google sheet id (see step 8 and line 104 of the code).

Step 4 : Click on Resources on top menu and then All your triggers.

If you have set triggers in the past, click on Add a new trigger. If no triggers are set, add new. Select CreateNewDraft (that is the main function), Time Driven, Day Timer, select time slot (I run this script between 1 am to 2 am each day).

Step 5 : Go to Google Drive and open a new Google Doc.

Step 6 : Name the Doc - Say hi. (just an example). Note the document id of the doc. See photo below.

pic_2

Step 7 : Type a message using html tags. If you are not well-versed with html, I have uploaded another program on GitHub (Plain2HTML) which converts your plain text to html text. Feel free to use it. Open notepad, copy the code and save as ".html" file. For the time being, let's use the following:

pic_4

You can type the above message in the Google Doc. Save and Close.

Step 8 : Go to Google Drive and open a new Google Sheet. Note down its id and use it in the code from GitHub. Rename the spreadsheet as List of Response Ids and fill it as shown below:

pic_3

Do not rename Sheet1. The Response Name column contains the names of the templates. The next column - Response Name Doc Id - contains the document id. See step 6. The third column is of the response labels.

This google spreadsheet works as a database system. In your GMail, you have two types of labels - day label and response label. Depending on the day, the program checks the response label and gets the html message from the template (Say hi) using the document id whose response label has matched. This html message is used as text in the GMail draft

Start your response labels with 1 or any number but keep the same number always. When the program sorts the labels of a GMail message, the response label will always be first. The program will always choose the first label after sorting.

You can add more templates below Say hi. You can modify the layout of the google spreadsheet but along with that you must also change the code in the function - getSheetID. See code from GitHub.

Step 9 : We are almost done. Go to GMail. Add the following labels to a test message.

Mon - this is the day label
1R/1 - this is the response label.
Step 10 : Come back to the google script editor. Click Resources, then Advanced Google Services. Locate Gmail API in the dialog and click the corresponding toggle, setting it to on.

Then click on Google Developers Console. Enter Gmail API into the search box and click on the corresponding entry in the results. Click the Enable API button.

You can now return to the Apps Script editor and click the OK button on the Advanced Google Services dialog.

Step 11 : And you are all set. Go to the Apps Script editor and select CreateNewDraft function. Click on Run icon (pic_6).

When you run the program for the first time, it may require authorization to run. If the dialog box appears, click on Review Permissions and then on Allow. Once allowed, further runs do not require authorization.

Step 12 : Check your GMail and you will see one email in the draft folder.

The program will automatically run every day at the specified time and draft messages for you in GMail.
