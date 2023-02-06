export class Formatter {

  static dateFormatter(pureDate) {
    function pad(n) { return n<10 ? "0"+n : n }
    return pureDate.getFullYear()+"-"+
      pad(pureDate.getMonth()+1)+"-"+
      pad(pureDate.getDate())+" "+
      pad(pureDate.getHours())+":"+
      pad(pureDate.getMinutes())+":"+
      pad(pureDate.getSeconds());
  }
}
