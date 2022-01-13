/** The purpose of this function is to get data out of a sheet and store it as an Object, instead of an 2D array.
    This is more helpful because it allows you to now get the desired values using the key instead of by index values, and the keys will always be the same as the column header.
    This makes your GAS agnostic to changes in the positioning of columns in your spreadsheet.
    See my examples and explanation below the code to learn more
**/

/** Sheet Data Object Returned, Structure and Properties overview

I want to quickly explain the structure of this data object you should expect and the properties the object has from this function

Object Data Structure:


{ hasData: true, 
      rows: 
        { '2': 
            { < Header 1 Value > : < Row 2, Col 1 Cell Value >, 
              < Header 2 Value > : < Row 2, Col 2 Cell Value >,
              .
              . (this pattern continues until the last column value X)
              .
              < Header X Value > : < Row 2, Col X Cell Value >,
              isRowEmpty: false
            }
        } 
    }
    
  Note: "<>" denotes a explanatory placeholder

Object Properties:

  hasData (boolean) = whether or not the requested range from sheet has non-empty rows data ignoring row 1, the header row.
  rows (object) = this is an object that stores each row #'s data expressed as an object made up that row #'s values for each different header/field.
  isRowEmpty(boolean) = whether or not this row # completely empty, meaning that every single entry is empty.
  
**/


var ss_url = "INSERT GOOGLE SHEET URL"; // This is the URL to the Google Spreadsheet you are using
var sheet_name = "INSERT SHEET NAME"; // This is the specific sheet you want to get data from, Ex: "New Leads"
var num_rows = "INSERT NUMBER"; // This is the number of rows you want to get out of the sheet

/** Get data from sheet and turn it into an Object **/
function getSheetDataObject(ss_url, sheet_name, num_rows) {
  var sheet = SpreadsheetApp.openByUrl(ss_url).getSheetByName(sheet_name);
  var rows_in_sheet = sheet.getLastRow(); // Total number of non-empty rows in the sheet, including the header
  const sheet_data_obj = {};
  sheet_data_obj['hasData'] = false; // We assume it has no data until prove otherwise
  const rows_obj = {};
  /** Proceed only if the number of rows requested to get is less than or equal to the number of rows that exist in the sheet **/
  if (num_rows <= rows_in_sheet){
    sheet_data_obj["hasData"] = true; 
    var sheet_data_arr = sheet.getRange(1,1,num_rows,sheet.getLastColumn()).getValues(); // Get all of the sheet data starting from (row 1, col 1) through (num_rows, last col with content)
    var headers = sheet_data_arr[0]; // Get the header values, row 1
    var rows = sheet_data_arr.splice(1,num_rows - 1); // All the rows after row 1
    /** Loop through the rows data **/
    rows.forEach(function(row,i){
      const row_obj = {};
      /** Loop through the values in the row **/
      var empty_element_count = 0;
      row.forEach(function(element,j){
        /** Check if this row's elements are empty, and count everytime they are **/
        if(element == ""){
          empty_element_count += 1;
        }
        /** Row Object structure -> Key = Header X, Value = Element X **/
        row_obj[headers[j]] = element;
      });
      var row_counter = 2 + i;
      row_obj['isEmptyRow'] = false;
      /** Check if this entire row is empty by comparing the empty element count to the # of elements in the row, and count every empty row **/
      if(empty_element_count == row.length){
        Logger.log("Row " + row_counter + " is completely empty!");
        empty_rows_counter += 1;
        row_obj['isEmptyRow'] = true;
      }
      /** Rows Object structure -> Key = Row #, Value = Row Object **/
      rows_obj[row_counter] = row_obj;
    });
    sheet_data_obj["rows"] = rows_obj; // Add the rows object to the sheet data object
  }
  //console.log(sheet_data_obj);
  return sheet_data_obj;
}

/** EXPLANATION AND EXAMPLES 

    2D array Ex: 
    
    Let's imagine you have a sheet with 2 columns and 3 rows, and row 1 is the header row that labels the column values.
    Row 1: ["firstName", "lastName"]
    Row 2: ["john", "smith"]
    Row 3: ["jane", "doe"]
    
    Note: "[]" denotes an array, "{}" denotes an object. 
    
    When you get this data out of the sheet using ".getRange().getValues()" it returns a 2D array, lets call it sheet_data_arr.
    The data in sheet_data_arr would look like:
    "[["firstName", "lastName"], ["john", "smith"], ["jane", "doe"]]"  (assuming we got all 3 rows of data)
    
    So, if you wanted to get Row 2's values you'd use "var row_2 = sheet_data_arr[1];" (use 1 because this is zero-indexed language, so row 2 is stored as index 1 in our array)
    This would work fine and return the expected ["john", "smith"]
    Now, if you just wanted the last name from Row 2, you'd use "var last_name = sheet_data_arr[1][1];" (just like row 2 is indexed as 1, so is column 2 in our array)
    Again, this works great and you get the expected "smith" value returned
    
    HOWEVER, what happens if a "middleName" column is added to your sheet in between "firstName" and "lastName"?
    Row 1: ["firstName", "middleName", "lastName"]
    Row 2: ["john", "charles", "smith"]
    Row 3: ["jane", "ellen", "doe"]
    
    Now, "var last_name = sheet_data_arr[1][1];" returns "charles" when we actually want "smith"
    Updating your code with a change like this is trivial when you only have 3 columns, but becomes a real pain when as you work with more data.
    
    --------------
    
    Storing this sheet data as an object fixes this and makes you robust against changes in your sheet's columns, 
    because instead of using hardcoded index values to access the data you want, you can use the header name which is our key value. 
    
    Object Ex:
    
    Let's imagine we have the same data as in the previous example, but this time we transform the data into an object using "getSheetDataObj()"
    
    Instead of sheet_data_arr, we store it in sheet_data_obj, which looks like this:
    { hasData: true, 
      rows: 
        { '2': 
            { firstName: 'john', 
              lastName: 'smith'
              isRowEmpty: false
            },
            
          '3': 
            { firstName: 'jane', 
              lastName: 'doe',
              isRowEmpty: false
            } 
        } 
    }
    
    So now, if you want to get the last name for person in Row 2, you'd use "var last_name = sheet_data_obj["rows"]['2']['lastName'];"
    This returns the expected "smith"
    
    Now if the "middleName" column gets added to the mix, it doesn't throw off our ability to retrieve the correct value, 
    because our code is now agnostic to that value's corresponding "column" index which just got changed with the new column being added. 
    
    I hope this helps you with your use of Google Apps Scripting! 
    
    If you have any thoughts, feedback or want to point out something I missed, please do!
    
**/

