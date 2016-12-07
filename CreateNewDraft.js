function CreateNewDraft()
{
 var today = new Date(); // get today's date.
 var labelArray = ["", "Mon", "Tue", "Wed", "Thu", "Fri", ""] // five day week - label for each day - Mon to Friday
 if ((today.getDay() == 0) || (today.getDay() == 6))
 {
   // If it is Saturday or Sunday, no drafts.
   return // uncomment this line
 } else 
 {
   // for other days, get the corresponding labelname for search.
   var labelname = labelArray[today.getDay()];
 }
  //var labelname = "ME"; // comment this line. for debugging only
  subfunction(labelname);
}

function subfunction(labelname) 
{
    var threads = GmailApp.getUserLabelByName(labelname).getThreads(); // get all threads
  // Follow code below for each thread
  for (i=0; i < threads.length; i++)
  {
    
    var thread = threads[i];
    var labels = thread.getLabels(); // for each thread, get all labels
    var glabelArray = [];
    // get label names
    for (v = 0; v < labels.length; v++)
         {
           glabelArray.push(labels[v].getName())
         }
    //Logger.log(glabelArray.sort());
    glabelArray = glabelArray.sort(); // sort label names in alphabetical order
    var resplabel = glabelArray[0]; // the response label starts with 1. hence it is always the first item in the sorted array
    var responseid = getSheetID(resplabel); // use the response label to get the ID of the sheet where response text is stored
    if (responseid == -1)
    {
      continue;
    }
    var messages = thread.getMessages(); // get all messages in that thread
    var lastmsg = messages.length - 1; // get last message in the thread
    var emailTo     = messages[lastmsg].getTo(); // get TO field of last message
    emailTo         = WebSafe(emailTo); // get only email id from TO field
    var emailFrom0   = messages[lastmsg].getFrom(); // get FROM field of last message
    var emailFrom       = WebSafe(emailFrom0); // get only email id from FROM field
    var emailCC     = messages[lastmsg].getCc(); // get CC field of last message
    emailCC         = WebSafe(emailCC); // get only email id from CC field
    // if no CC is marked in the email, use only TO field else use TO and CC field in "message" (see CreateDraft).
    if (emailTo == "")
	{
       var emailCcHdr = emailCC;
    } else
    {
      if (emailCC == "")
      {
        var emailCcHdr = emailTo;
      } else
      {
        var emailCcHdr = emailTo + "," + emailCC;
      }
    }
    var subject     = messages[lastmsg].getSubject(); // get SUJECT field
    subject = subject.replace(/([\[\(] *)?(RE|FWD?) *([-:;)\]][ :;\])-]*|$)|\]+ *$/igm,""); // remove REs and FWDs etc from subject line
    var emailmsg    = messages[lastmsg].getBody(); // get html content of last message
    var emaildate   = messages[lastmsg].getDate(); // get DATE field of last message
    var attachments = messages[lastmsg].getAttachments();
    var AName = [];
    var AMimeType = [];
    var ABytes = [];
    for (k = 0; k < attachments.length; k++)
    {
        var fullname = attachments[k].getName();
	var attsize = attachments[k].getSize();
        if (attsize > 9500000) {continue} // if attachment size is more than 9.5 MB, continue to next attachment
        var ext = fullname.split(".")[fullname.split(".").length - 1];
        var mT = GetMimeType(ext);
        if (!mT) {continue;}
        AName.push(fullname);
        AMimeType.push(mT);
        ABytes.push(Utilities.base64Encode(attachments[k].getBytes()));
    }
    var data = 
        {
          "responseid"  : responseid,
          "emailCcHdr"  : emailCcHdr,
          "emailFrom"   : emailFrom,
          "subject"     : subject,
          "emailmsg"    : emailmsg,
          "emaildate"   : emaildate,
          "emailFrom0"  : emailFrom0,
          "labelname"   : labelname,
          "thread"      : thread,
          "AName"       : AName,
          "AMimeType"   : AMimeType,
          "ABytes"      : ABytes
        };
    CreateDraft(data);
  }
}

function GetMimeType (ext)
{
  if (ext == "pdf")  {var mT = "application/pdf"}
  if (ext == "bmp")  {var mT = "image/bmp"}
  if (ext == "gif")  {var mT = "image/gif"}
  if (ext == "jpeg") {var mT = "image/jpeg"}
  if (ext == "jpg")  {var mT = "image/jpg"}
  if (ext == "png")  {var mT = "image/png"}
  if (ext == "svg")  {var mT = "image/svg"}
  if (ext == "tif")  {var mT = "image/tif"}
  if (ext == "css")  {var mT = "text/css"}
  if (ext == "csv")  {var mT = "text/csv"}
  if (ext == "html") {var mT = "text/html"}
  if (ext == "txt")  {var mT = "text/txt"}
  if (ext == "xls")  {var mT = "application/vnd.ms-excel"}
  if (ext == "xlt")  {var mT = "application/vnd.ms-excel"}
  if (ext == "xla")  {var mT = "application/vnd.ms-excel"}
  if (ext == "xlsx") {var mT = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"}
  if (ext == "xltx") {var mT = "application/vnd.openxmlformats-officedocument.spreadsheetml.templatet"}
  if (ext == "xlsm") {var mT = "application/vnd.ms-excel.sheet.macroEnabled.12"}
  if (ext == "xltm") {var mT = "application/vnd.ms-excel.template.macroEnabled.12"}
  if (ext == "xlam") {var mT = "application/vnd.ms-excel.addin.macroEnabled.12"}
  if (ext == "xlsb") {var mT = "application/vnd.ms-excel.sheet.binary.macroEnabled.12"}
  if (ext == "doc")  {var mT = "application/msword"}
  if (ext == "dot")  {var mT = "application/msword"}
  if (ext == "docx") {var mT = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"}
  if (ext == "dotx") {var mT = "application/vnd.openxmlformats-officedocument.wordprocessingml.template"}
  if (ext == "docm") {var mT = "application/vnd.ms-word.document.macroEnabled.12"}
  if (ext == "dotm") {var mT = "application/vnd.ms-word.template.macroEnabled.12"}
  if (ext == "ppt")  {var mT = "application/vnd.ms-powerpoint"}
  if (ext == "pot")  {var mT = "application/vnd.ms-powerpoint"}
  if (ext == "pps")  {var mT = "application/vnd.ms-powerpoint"}
  if (ext == "ppa")  {var mT = "application/vnd.ms-powerpoint"}
  if (ext == "pptx") {var mT = "application/vnd.openxmlformats-officedocument.presentationml.presentation"}
  if (ext == "potx") {var mT = "application/vnd.openxmlformats-officedocument.presentationml.template"}
  if (ext == "ppsx") {var mT = "application/vnd.openxmlformats-officedocument.presentationml.slideshow"}
  if (ext == "ppam") {var mT = "application/vnd.ms-powerpoint.addin.macroEnabled.12"}
  if (ext == "pptm") {var mT = "application/vnd.ms-powerpoint.presentation.macroEnabled.12"}
  if (ext == "potm") {var mT = "application/vnd.ms-powerpoint.template.macroEnabled.12"}
  if (ext == "ppsm") {var mT = "application/vnd.ms-powerpoint.slideshow.macroEnabled.12"}
  if (ext == "zip")  {var mT = "application/zip"}
  if (ext == "rar")  {var mT = "application/x-rar-compressed"}
  return mT
}

function WebSafe(fullstring)
{
  var splitString = fullstring.split(",");
  var finalarray = [];
  for (u=0; u < splitString.length; u++)
  {
    var start_pos = splitString[u].indexOf("<") + 1;
    var end_pos   = splitString[u].indexOf(">",start_pos);
    if (!(splitString[u].indexOf("<") === -1 && splitString[u].indexOf(">",start_pos) === -1)) // if < and > do exist in string
    {
      finalarray.push(splitString[u].substring(start_pos, end_pos));
    }
  }
  var index = finalarray.indexOf("abc@xyz.in"); // use your email id. if the array contains your email id, it is removed.
  if (index > -1) {finalarray.splice(index, 1);}
  return finalarray
}


function getSheetID(resplabel)
{
   // this function gets the ID of the sheet where the response template is stored. this sheet acts like a database
    var sheet = SpreadsheetApp.openById("type-your-google-sheet-id"); // this is the ID of the sheet where all response sheet IDs are stored
    var column = 4; //column number where the response IDs are stored.
    var lastrow = sheet.getSheetByName('Sheet1').getLastRow();
    var columnValues = sheet.getSheetByName('Sheet1').getRange(3, column, lastrow).getValues(); // my values start from row 3.
    var searchResult = columnValues.findIndex(resplabel); //Row Index - 2
    if(searchResult != -1)
    {
        // (searchResult + 3) is the row index where response label is matched.
        var sheetID = sheet.getSheetByName('Sheet1').getRange(searchResult + 3, 3).getValue(); // sheet IDs are in 3rd column.
        return sheetID;
    } else
    {
      return -1;
    }
}

Array.prototype.findIndex = function(search)
{
  if(search == "") return false;
  for (var i=0; i<this.length; i++)
    if (this[i].toString().indexOf(search) > -1 ) return i;

  return -1;
} 

function CreateDraft(data) 
{ 
  var edate = Utilities.formatDate(data["emaildate"], "IST", "EEE, MMM d, yyyy"); // get date component from emaildate
  var etime = Utilities.formatDate(data["emaildate"], "IST", "h:mm a"); // get time component from emaildate
  if (data["emailFrom"].length == 0)
  {
    // if emailFrom is empty, it probably means that you may have written the last message in the thread. Hence 'you'.
    //Logger.log("emailFrom is null");
    var emailheader = '<html><body>' + 
                      'On' + '&nbsp;' +
                       edate + '&nbsp;' + 
                      'at' + '&nbsp;' + 
                       etime +  ',' + '&nbsp;' + 'you' + '&nbsp;' + 'wrote:' + '</body></html>';
  } else 
  {
    var emailheader = '<html><body>' + 
                      'On' + '&nbsp;' +
                       edate + '&nbsp;' + 
                      'at' + '&nbsp;' + 
                        etime +  ',' + '&nbsp;' + data["emailFrom0"] + '&nbsp;' + 'wrote:' + '</body></html>';
  }
  var emailsig = '<html>' + 
                 '<div>Thanks &amp; Best Regards,</div>' +
                 '<div>Rishi Bawdekar</div>'; // your email signature i.e. common for all emails.
  
  var doc = DocumentApp.openById(data["responseid"]); // Response ID of Template
  var htmlBody = doc.getBody().getText(); // get html text from the template.
  var forScope  = GmailApp.getInboxUnreadCount(); // needed for auth scope
  
  var myEmailAddress = "abc@xyz.in" // Change to your email address!
  var boundary = "123456654321";
  
  var message = 'From: ' + myEmailAddress + '\n' +
			          'To: ' +   data["emailFrom"] + '\n' +
				        'Cc: ' +   data["emailCcHdr"] + '\n' +
			          'Subject: ' + data["subject"] + '\n' +
				        'MIME-Version: 1.0' + '\n' +
			          'Content-Type: multipart/mixed;' +
				        'boundary="' + boundary + '"' + '\n\n' +
										  
			         	'--' + boundary + '\n' +
				        'Content-Type: text/html; charset="UTF-8";' + '\n' +
				        'Content-Transfer-Encoding: base64' + '\n\n' +
										  
			        	 htmlBody + '<br>' + emailsig + '<br>' + emailheader + '<br>' + data["emailmsg"] + '\n';
  
  var msgattach = "";
  for (u=0; u < data["AName"].length; u++)
  {
    var tempattach = '--' + boundary + '\n' +
                     'Content-Type: ' + data["AMimeType"][u] + '; name="' + data["AName"][u] + '"' + '\n' +
                     'Content-Disposition: attachment; filename="' + data["AName"][u] + '"' + '\n' +
                     'Content-Transfer-Encoding: base64' + '\n\n' +
                      
                      data["ABytes"][u] + '\n';
    
    msgattach += tempattach;
  }

  message += msgattach;
  
  var endofmessage = '--' + boundary + '--';
  
  message += endofmessage;
  
  var draftBody = Utilities.base64Encode(message).replace(/\=/g, "").replace(/\+/g,'-').replace(/\//g,'_'); //baseurl64 encoding
  
  var params = {method:"post",
                contentType: "message/rcf2822",               
                headers: {"Authorization": "Bearer " + ScriptApp.getOAuthToken()},
                muteHttpExceptions:true,
                payload:JSON.stringify(
                  { "message": 
                   { "raw": draftBody } 
                  }  )
               };                                               
  var resp = UrlFetchApp.fetch("https://www.googleapis.com/gmail/v1/users/me/drafts?uploadType=media", params);
  var respobj = JSON.parse(resp.getContentText()); //  converts string to JSON object
  if (respobj.message.id) // if draft is created, it will have an id. if id is found, remove labels.
  {
    RemoveLabel(data["labelname"], data["thread"]);
  }
}

function RemoveLabel(labelname, thread)
{
  var alllabels = thread.getLabels();
  var salllabels = [];
  for (j = 0; j < alllabels.length; j++)
      {
         salllabels.push(alllabels[j].getName());
      }
  salllabels = salllabels.sort();
  if (!(salllabels[0].indexOf("1R/") === -1)) // first label contains "1R/" -> response label
  {
    GmailApp.getUserLabelByName(salllabels[0]).removeFromThread(thread);
    GmailApp.getUserLabelByName(labelname).removeFromThread(thread);
  }
}
