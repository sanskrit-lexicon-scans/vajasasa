// (setq js-indent-level 1)  # for Emacs

function makelink(indexobj,txt) {
 let href = window.location.href;
 //let url = new URL(href);
 //let search = url.search  // a string, possibly empty
 // href: main.js:7 http://localhost/sanskrit-lexicon-scans/vajasasa/app1/?5,2
 //console.log(href);
 let base = href.replace(/app1.*$/,'');
 //console.log(base);
 //let adhy = indexobj.adhy;
 //let v2 = indexobj.v2;
 // switch to app0 
 //let newsearch = `?${adhy},${v2}`;
 let ipage = indexobj.ipage
 let newsearch = `app0/?${ipage}`;
 let newhref = base + newsearch;
 let html = `<a class="nppage" href="${newhref}"><span class="nppage">${txt}</span></a>`;
 return html;
}
function display_ipage_id(indexes) {
 //console.log('display_ipage_id: indexes=',indexes);
 [indexprev,indexcur,indexnext] = indexes;
 let prevlink = makelink(indexprev,'<');
 let nextlink = makelink(indexnext,'>');

 let ipage = indexcur['ipage']; // an int

 let html = `<p>${prevlink} <span class="nppage">Page ${ipage}</span> ${nextlink}</p>`;
 let elt = document.getElementById('ipageid');
 elt.innerHTML = html;
}

function get_pdfpage_from_index(indexobj) {
/* indexobj assumed an element of indexdata
 return name of file with the given page
 vaj-NNNN.pdf 
*/
 let vp = indexobj['vp'];
 let pdf = `vaj-${vp}.pdf`;
 return pdf;
}

function get_ipage_html(indexcur) {
 let html = null;
 if (indexcur == null) {return html;}
 let pdfcur = get_pdfpage_from_index(indexcur);
 //console.log('pdfcur=',pdfcur);
 let urlcur = `../pdfpages/${pdfcur}`;
 let android = ` <a href='${urlcur}' style='position:relative; left:100px;'>Click to load pdf</a>`;
 let imageElt = `<object id='servepdf' type='application/pdf' data='${urlcur}' 
              style='width: 98%; height:98%'> ${android} </object>`;
 //console.log('get_ipage_html. imageElt=',imageElt);
 return imageElt;
}

function display_ipage_html(indexes) {
 display_ipage_id(indexes);
 let html = get_ipage_html(indexes[1]);
 let elt=document.getElementById('ipage');
 elt.innerHTML = html;
}

function get_indexobjs_from_verse(verse) {
 // uses indexdata from index.js
 // verse is a 2-tuple of ints
 let icur = -1;
 for (let i=0; i < indexdata.length; i++ ) {
  let obj = indexdata[i];
  if (obj.adhy != verse[0]) {
   continue;
  }
  if ((obj.v1 <= verse[1]) && (verse[1] <= obj.v2)) {
   icur = i;
   break;
  }
 }
 let ans, prevobj, curobj, nextobj
 if (icur == -1) {
  // default
  prevobj = indexdata[0];
  curobj = indexdata[0];
  nextobj = indexdata[1];
  ans  = [indexdata[0],indexdata[1],indexdata[2]];
 } else {
  curobj = indexdata[icur];
  if (icur <= 0) {
   prevobj = curobj;
  } else {
   prevobj = indexdata[icur - 1];
  }
  let inext = icur + 1;
  if (inext < indexdata.length) {
   nextobj = indexdata[inext];
  }else {
   nextobj = curobj;
  }
 }
 ans = [prevobj,curobj,nextobj];
 return ans;
}

function get_verse_from_url() {
 /* return 2-tuple of int numbers derived from url search string.
    Returns [0,0] if problem
*/
 let href = window.location.href;
 let url = new URL(href);
 // url = http://xyz.com?X ,
 // search = ?X
 let search = url.search;  // a string, possibly empty
 let defaultval = [0,0]; // default value (title verse)
 let x = search.match(/^[?]([0-9]+),([0-9]+)$/);
 if (x == null) {
  return defaultval;
 }
 // convert to ints
 let nparm = 2;
 iverse = [];
 for(let i=0;i<nparm;i++) {
  iverse.push(parseInt(x[i+1]));
 }
 //console.log('x=',x);
 //console.log('iverse=',iverse);
 return iverse;
}

function display_ipage_url() {
 let url_verse = get_verse_from_url();
 //console.log('url_verse=',url_verse);
 let indexobjs = get_indexobjs_from_verse(url_verse);
 //console.log('indexobjs=',indexobjs);
 display_ipage_html(indexobjs);
}

document.getElementsByTagName("BODY")[0].onload = display_ipage_url;

