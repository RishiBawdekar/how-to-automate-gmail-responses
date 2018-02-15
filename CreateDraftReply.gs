function createdraftgmail()
{
	 var today = new Date(); // get today's date.
	 var labelArray = ["", "TS1", "TS2", "TS3", "TS4", "TS5", ""]; // five day week - label for each day - Mon to Friday
	 if ((today.getDay() == 0) || (today.getDay() == 6))
	 {
	   // If it is Saturday or Sunday, no drafts.
	   return
	 } else 
	 {
	   // for other days, get the corresponding labelname for search.
	   var labelname = labelArray[today.getDay()];
	 }
	 var threads = GmailApp.getUserLabelByName(labelname).getThreads(); // get all threads
	 // Follow code below for each thread
	 
	 for (i=0; i < threads.length; i++)
	  {
		var thread = threads[i]; // select thread i
		var labels = thread.getLabels(); // get all labels of thread i
		var glabelArray = []; // initialize empty array for storing GMail label names
		// the following loop stores GMail label names in glabelArray array.
		for (v = 0; v < labels.length; v++)
			 {
			   glabelArray.push(labels[v].getName())
			 }
		glabelArray = glabelArray.sort(); // sort label names in alphabetical order
		var resplabel = glabelArray[0]; // the response label starts with 1. hence it is always the first item in the sorted array
		var responseid = getSheetIDADV(resplabel); // use the response label to get the ID of the sheet where response text is stored
		if (responseid == -1)
		{
		  continue;
		}
		var doc      = DocumentApp.openById(responseid); // Open Google Doc having responseid as Id. Template is stored in Google Doc.
		var htmlBody = doc.getBody().getText(); // get html text from the template.
		
		var myEmailAddress = "youremail@example.com" // replace youremail@example.com with your email address.
		
		var messages = thread.getMessages(); // get all messages in thread i
		var lastmsg  = messages.length - 1;  // get last message in thread i
		
		var emailTo    = WebSafe(messages[lastmsg].getTo());    // get only email id from To field of last message
		var emailFrom  = WebSafe(messages[lastmsg].getFrom());  // get only email id from FROM field of last message
		var emailCC    = WebSafe(messages[lastmsg].getCc());    // get only email id from CC field of last message
		
		// form a new CC header for draft email
		if (emailTo == "")
		{
		   var emailCcHdr = emailCC.toString();
		} else
		{
		  if (emailCC == "")
		  {
			var emailCcHdr = emailTo.toString();
		  } else
		  {
			var emailCcHdr = emailTo.toString() + "," + emailCC.toString();
		  }
		}

		var subject  = messages[lastmsg].getSubject().replace(/([\[\(] *)?(RE|FWD?) *([-:;)\]][ :;\])-]*|$)|\]+ *$/igm,"");
		// the above line remove REs and FWDs etc from subject line
		
		var emailmsg = messages[lastmsg].getBody(); // get html content of last message
		
		var emaildate   = messages[lastmsg].getDate(); // get DATE field of last message

		var attachments = messages[lastmsg].getAttachments(); // get all attachments of last message
		
		var edate = Utilities.formatDate(emaildate, "IST", "EEE, MMM d, yyyy"); // get date component from emaildate
		var etime = Utilities.formatDate(emaildate, "IST", "h:mm a"); // get time component from emaildate
		if (emailFrom.length == 0)
		{
		  // if emailFrom is empty, it probably means that you may have written the last message in the thread. Hence 'you'.
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
							 etime +  ',' + '&nbsp;' + emailFrom + '&nbsp;' + 'wrote:' + '</body></html>';
		}
		  var emailsig = '<html>' + 
						 '<div>your email signature,</div>' +
						 '</html>'; // your email signature i.e. common for all emails.
			
		  var draftmsg = htmlBody + '<br>' + emailsig + '<br>' + emailheader + '<br>' + emailmsg + '\n'; // message content of draft
		
		  messages[lastmsg].createDraftReply(" ", 
				{
				  subject: subject,
				  cc: emailCcHdr.toString(),
				  htmlBody: draftmsg,
				  attachments: attachments,
				});
		  var draft = GmailApp.getDrafts()[0]; // The first draft message in the drafts folder
		  if (draft.getId())
			{
			  RemoveLabel(labelname, thread);
			}
	  }
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
    } else if (!(splitString[u].indexOf("@") === -1))
    {
      finalarray.push(splitString[u]);
    }
  }
  var index = finalarray.indexOf("youremail@example.com"); // use your email id. if the array contains your email id, it is removed.
  if (index > -1) {finalarray.splice(index, 1);}
  return finalarray
}


function getSheetID(resplabel)
{
   // this function gets the ID of the sheet where the response template is stored. this sheet acts like a database
    var sheet = SpreadsheetApp.openById("sheet_id_of_google_spreadsheet"); // replace "sheet_id_of_google_spreadsheet" with Id of sheet where responseids are stored
    var column = 4; //column number where the responseids are stored.
    var lastrow = sheet.getSheetByName('Sheet1').getLastRow();
    var columnValues = sheet.getSheetByName('Sheet1').getRange(3, column, lastrow).getValues(); // my values start from row 3.
    var searchResult = columnValues.findIndex(resplabel); //Row Index - 2
    if(searchResult != -1)
    {
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
