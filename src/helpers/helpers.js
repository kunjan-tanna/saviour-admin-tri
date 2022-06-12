/**
 * Helpers Functions
 */
import moment from 'moment';

/**
 * Function to convert hex to rgba
 */
export function hexToRgbA(hex, alpha) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split('');
        if (c.length === 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = '0x' + c.join('');
        return 'rgba(' + [(c >> 16) & 255, (c >> 8) & 255, c & 255].join(',') + ',' + alpha + ')';
    }
    throw new Error('Bad Hex');
}

/**
 * Text Truncate
 */
export function textTruncate(str, length, ending) {
    if (length == null) {
        length = 100;
    }
    if (ending == null) {
        ending = '...';
    }
    if (str.length > length) {
        return str.substring(0, length - ending.length) + ending;
    } else {
        return str;
    }
}

/**
 * Get Date
 */
export function getTheDate(timestamp, format) {
    let time = timestamp * 1000;
    let formatDate = format ? format : 'MM-DD-YYYY';
    return moment(time).format(formatDate);
}


export function getFormattedDates(date){
    let currentDate = new Date()
    if(date != undefined) {
      currentDate = date
    }
    var str = "";
    let year = currentDate.getFullYear()
    let month = currentDate.getMonth() + 1
    if(month<10){
      month = '0'+month
    }
    let day = currentDate.getDate()
    if(day<10){
      day = '0'+day
    }
    var hours = currentDate.getHours()
    var minutes = currentDate.getMinutes()
    var seconds = currentDate.getSeconds()

    if (minutes < 10) {
        minutes = "0" + minutes
    }
    if (seconds < 10) {
        seconds = "0" + seconds
    }
    str += hours + ":" + minutes + ":" + seconds + " ";
    if(hours > 11){
        str += "PM"
    } else {
        str += "AM"
    }
    return (`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`)
  }

/**
 * Convert Date To Timestamp
*/

export function convertSecondToTime(sec) {
    console.log('welcome convertSecondToTime')
    var obj = '';
    var secs = Math.trunc(sec)
    var hours = Math.floor(secs / (60 * 60));
    if(hours > 0){
        obj += hours +':'
    }
    var divisor_for_minutes = secs % (60 * 60);
    var minutes = Math.floor(divisor_for_minutes / 60);

    if(minutes<10){
        obj +='0'+ minutes + ':'
    }else{
        obj += minutes + ':'
    }
         

    var divisor_for_seconds = divisor_for_minutes % 60;
    var seconds = Math.ceil(divisor_for_seconds);
   
    if(seconds<10){
        obj += '0'+seconds 
    }else{
        obj += seconds 
    }

   
    console.log('objobjobj',obj)
    return obj;
}

export function convertDateToTimeStamp(date, format) {
    let formatDate = format ? format : 'YYYY-MM-DD';
    return moment(date, formatDate).unix();
}

export function getFormattedDate(datetime){
      if(datetime != undefined) {
        currentDate = datetime
      }
      var str = "";
      let currentDate = new Date(datetime*1000)
      let year = currentDate.getFullYear()
      let month = currentDate.getMonth() + 1
      if(month<10){
        month = '0'+month
      }
      let day = currentDate.getDate()
      if(day<10){
        day = '0'+day
      }
      var hours = currentDate.getHours()
      var minutes = currentDate.getMinutes()
      var seconds = currentDate.getSeconds()

      if (minutes < 10) {
          minutes = "0" + minutes
      }
      if (seconds < 10) {
          seconds = "0" + seconds
      }
      str += hours + ":" + minutes + ":" + seconds + " ";
      if(hours > 11){
          str += "PM"
      } else {
          str += "AM"
      }
      return (`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`)
  }

/**
 * Function to return current app layout
 */
export function getAppLayout(url) {
    let location = url.pathname;
    let path = location.split('/');
    return path[1];
}