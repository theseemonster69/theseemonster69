var mastersel = document.getElementById("master-dropdown-list");
var rightselopt = document.getElementById("tzlist-right").options;
var leftselopt = document.getElementById("tzlist-left").options;
for( i=0; i<mastersel.options.length; i++ )
{
   rightselopt[rightselopt.length] = new Option(mastersel.options[i].text,mastersel.options[i].value);
   leftselopt[leftselopt.length] = new Option(mastersel.options[i].text,mastersel.options[i].value);
}
var APM = '';

function UpdateTimezoneFields()
{
   APM = '';
   var fromtime = document.getElementById("tzinput-left").value;
   var fromdrop = document.getElementById("tzlist-left").options[document.getElementById("tzlist-left").selectedIndex].value;
   var todrop = document.getElementById("tzlist-right").options[document.getElementById("tzlist-right").selectedIndex].value;
   if( ! (fromtime.length && fromdrop.length && todrop.length) )
   {
      alert('The time to convert from and both dropdowns all need to be specified.');
      return;
   }
   fromtime = ConformTime(fromtime);
   fromtime = ConvertTo24hourClock(fromtime);
   if( document.getElementById("tzdst-left").checked ) { fromtime = DSTadjustment(fromtime,false); }
   var totime = ConvertToFromGMT(fromtime,fromdrop,true);
   totime = ConvertToFromGMT(totime,todrop,false);
   if( document.getElementById("tzdst-right").checked ) { totime = DSTadjustment(totime,true); }
   totime = ConvertTo12hourClock(totime);
   document.getElementById("tzinput-right").innerHTML = totime;
} // function UpdateTimezoneFields()

function ConvertTo24hourClock(tm)
{
   if( ! APM.length ) { return tm; }
   var ta = tm.split(":",2);
   var h = Math.abs(parseInt( ta[0].replace(/\D/g,"") ));
   var m = Math.abs(parseInt( ta[1].replace(/\D/g,"") ));
   if( ( APM.substr(-2) == "AM" ) && h == 12 )  { h = 0; }
   else if( ( APM.substr(-2) == "PM" ) && h < 12 )  { h += 12; }
   return h + ":" + MinimumTwoDigits(m);
} // function ConvertTo24hourClock()

function ConvertTo12hourClock(tm)
{
   if( ! APM.length ) { return tm; }
   var ta = tm.split(":",2);
   var h = Math.abs(parseInt( ta[0].replace(/\D/g,"") ));
   var m = Math.abs(parseInt( ta[1].replace(/\D/g,"") ));
   var localapm = " AM";
   if( h == 0 ) { h = 12; }
   else if( h >= 12 )
   {
      localapm = " PM";
      if( h > 12) { h -= 12; }
   }
   return h + ":" + MinimumTwoDigits(m) + localapm;
} // function ConvertTo12hourClock()

function ConformTime(tm)
{
   var ta = tm.split(":",2);
   var am = /am/i.test(ta[1]) ? true : false;
   var pm = /pm/i.test(ta[1]) ? true : false;
   if( am && pm ) { am = false; }
   if( am ) { APM = " AM"; }
   else if( pm ) { APM = " PM"; }
   var h = Math.abs(parseInt( ta[0].replace(/\D/g,"") ));
   var m = Math.abs(parseInt( ta[1].replace(/\D/g,"") ));
   if( am || pm )
   {
      if( h == 0 ) { h = 12; }
      else if( h > 12 ) { return MessageNow("Hour number for 12-hour clock can't be more than 12"); }
   }
   else if( h > 23 ) { return MessageNow("Hour number can't be more than 23. Use 0 for beginning of day."); }
   return h + ":" + MinimumTwoDigits(m) + APM;
} // function ConformTime()

function DSTadjustment(tm,add)
{
   var ta = tm.split(":",2);
   var h = parseInt(ta[0]);
   var m = parseInt(ta[1]);
   if( add ) { h++; }
   else { h--; }
   if( h < 1 ) { h = 23; }
   else if( h > 23 ) { h = 0; }
   return h + ":" + MinimumTwoDigits(m);
} // function DSTadjustment()

function ConvertToFromGMT(tm,val,from)
{
   var plus = (val.substr(0,1)=="+") ? true : false;
   if( from ) { plus = (!plus); }
   var ta = val.split(":",2);
   var fh = Math.abs(parseInt( ta[0].replace(/\D/g,"") ));
   var fm = Math.abs(parseInt( ta[1].replace(/\D/g,"") ));
   ta = tm.split(":",2);
   var h = Math.abs(parseInt( ta[0].replace(/\D/g,"") ));
   var m = Math.abs(parseInt( ta[1].replace(/\D/g,"") ));
   if( plus ) { h += fh; m += fm; }
   else { h -= fh; m -= fm; }
   if( m > 59 ) { h++; m -= 60; }
   if( m < 0 ) { h--; m += 60; }
   if( h > 23 ) { h -= 24; }
   if( h < 0 ) { h += 24; }
   return h + ":" + MinimumTwoDigits(m);   
} // function ConvertToGMT()

function MinimumTwoDigits(n)
{
   var s = new String(n);
   while( s.length < 2 ) { s = "0" + s; }
   return s;
} // function MinimumTwoDigits()

function MessageNow(s)
{
   alert(s);
   return '';
} // function MessageNow()