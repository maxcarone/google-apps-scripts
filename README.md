# google-apps-scripts
A repository of hopefully helpful Google Apps Scripts(GAS) I've created. 

This is where I would like to keep and share any useful GAS scripts or functions I've written to achieve common tasks like: getting data out of a spreadsheet, putting data into a spreadshet, etc.

Quick Description of each script added:

getSheetDataObj.gs: 
The purpose of this function is to get data out of a sheet and store it as an Object, instead of an 2D array. This is more helpful because it allows you to now get the desired values using the key instead of by index values, and the keys will always be the same as the column header. This makes your GAS agnostic to changes in the positioning of columns in your spreadsheet.
