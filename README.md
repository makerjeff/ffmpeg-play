# FFMPEG PLAY
Experimenting with FFMPEG and FFMPEG node modules.

## Notes
- [Install FFMPEG on Raspberry Pi3](http://hannes.enjoys.it/blog/2016/03/ffmpeg-on-raspbian-raspberry-pi/)
- [How to install FFMPEG on Mac OSX](http://www.renevolution.com/ffmpeg/2013/03/16/how-to-install-ffmpeg-on-mac-os-x.html)
- [Hong Kiat: FFMPEG Guide](http://www.hongkiat.com/blog/ffmpeg-guide/)
- [FFMPEG Documentation](https://ffmpeg.org/ffmpeg.html)
- [Stack overflow: Concatenating Videos](http://stackoverflow.com/questions/7333232/concatenate-two-mp4-files-using-ffmpeg)
- [FFMPEG Concatenate](https://trac.ffmpeg.org/wiki/Concatenate)
- [Executing a Command-Line Binary with Node.JS](http://stackoverflow.com/questions/20643470/execute-a-command-line-binary-with-node-js)
- ffmpeg -i {input file} -s 1280x720 -crf 18 {output file}
- ffmpeg -i {input file} -b:a 320k {output file}    //set audio bitrate to 320k
- ffmpeg -i {input file} -b:v 1000k {output file}   //set video bitrate to 1000k
- ffmpeg -i {input file} -filter:a "volume=2" {output file}     //double the volume
- ffmpeg -i {input file} -filter:v "crop=w=640:h=480:x=100:y=200" {output file}   //video crop
- ffmpeg -i {input file} -filter:v "scale=w=2/3*in_w:h=-1" {output file}           //scale with maths and proportional scaling.
- ffmpeg -i {input file} -filter:v "rotate=45*PI/180" {output file}     //rotate video clip
- ffmpeg -i {input file} -filter:v "rotate=45*PI/180, scale=w=640:h=-1" {output file}   //multiple filters example
- ffmpeg -i {input file} -c copy {output file}      // tell ffmpeg to only copy and don't transcode. '-c {codec}'
- "-r {rate in decimal}" to specify "rate"
- -filter:v and -vf is the same thing.
- "-ss {seconds}" seek to position in seconds
- "-sseof {seconds}" seek to position relative to 'end of file' (use negative numbers).
- [FFMPEG ProRes to MP4: Explicitly set pixel format with 'pix_fmt yuv420p'](http://superuser.com/questions/855678/ffmpeg-mov-prores-to-mp4)
- [Bootstrap Modal Close Event](http://www.coding-issues.com/2014/06/bootstrap-modal-close-event.html)
- [NPM Body Parser](https://www.npmjs.com/package/body-parser)
- [encodeURIComponent: Use this to ensure questionmarks get encoded.](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent)
- [Debian.org FFMPEG and Libav (DOES NOT WORK FOR RASPBERRY PI, see below)](https://wiki.debian.org/ffmpeg)
- [Compiling FFMPEG on raspbian / Raspberry Pi](http://hannes.enjoys.it/blog/2016/03/ffmpeg-on-raspbian-raspberry-pi/)
- GIT is a root process, so make sure you change the ownership of cloned git repo folder before trying to write to it with RSYNC or SCP.
- [Node Clusters Tutorial (also benchmarking with Seige)](http://rowanmanning.com/posts/node-cluster-and-express/)
- [MongoDB GridFS: For files larger than 16mb](https://docs.mongodb.com/v3.0/core/gridfs/)
- [JQuery AJAX Add Headers](http://api.jquery.com/jquery.ajax/)
- [Google+ Domains API: Inserting Media](https://developers.google.com/+/domains/api/media/insert)
- [Words API (for finding alternative words in our library)](https://www.wordsapi.com/)
- **!! IMPORTANT !!** : Any ASYNC operation for the file system needs to be Promisified, or just do a sync operation.
- [NPM Junk: Regex that removes junk files from array](https://www.npmjs.com/package/junk)
- [NPM Node-UUID: Create UUIDs for temp filelist creation](https://www.npmjs.com/package/node-uuid)
- [NPM ShortId for filelist ID creation](https://www.npmjs.com/package/shortid)
- [printf instead of echo for filelist creation](http://unix.stackexchange.com/questions/65803/why-is-printf-better-than-echo)
- [Array.shift(): Use this and Array.split('.') to return a file name without extension](http://www.w3schools.com/jsref/jsref_shift.asp)
- [Disable FFMPEG safe mode: -safe 0](http://stackoverflow.com/questions/38996925/ffmpeg-concat-unsafe-file-name)
- [Authenticate Node Application with JSON Web Tokens](https://scotch.io/tutorials/authenticate-a-node-js-api-with-json-web-tokens)
- [Linux file name limit : 255 characters](http://serverfault.com/questions/9546/filename-length-limits-on-linux)
- [TERMINAL COLORS](http://jafrog.com/2013/11/23/colors-in-terminal.html)
- [REGEX String Stripping Punctuation](http://stackoverflow.com/questions/4328500/how-can-i-strip-all-punctuation-from-a-string-in-javascript-using-regex)
- [REGEX String Stripping multiple spaces and tabs, etc](http://stackoverflow.com/questions/1981349/regex-to-replace-multiple-spaces-with-a-single-space)
- [REGEX Remove trailing spaces](http://stackoverflow.com/questions/9532340/how-to-remove-trailing-white-spaces-using-a-regular-expression-without-removing)
- [REGEX W3Schools reference](http://www.w3schools.com/jsref/jsref_obj_regexp.asp)
    - Remove trailing white space:    var string4 = string3.replace(/[ \t]+$/g, '');
    - Remove leading white space:    var string5 = string4.replace(/^[ \t]/g, '');
    - Find an email:    var emailRegExp = /[A-Za-z0-9._-]+@[A-Za-z0-9._-]+\.[A-Za-z]{2,4}/;
    - '.' (period) represents any 1 character, not new line.
    - [0-9] any number, [^0-9] anything NOT a number.
    - \w A-Z, a-z, 0-9 or _
    - \W anything NOT \w
    - \s spaces, \S not spaces.
    - \d any number, \D anything not a number.
    - \b word boundary (a space with something before and after it), \B anything not a word boundary.
    - [0-9]? = one number
    - [0-9]+ = one or more number
    - [0-9]* = zero or more (doesn't have to exist)
    - [Aa] = one 'A', or one 'a'
    - ^ beginning of the string.
    - $ end of a string.
    - g = global.
    - i = case insensitive.


- [Foolproof HTML Escaping in JS](http://shebang.brandonmintern.com/foolproof-html-escaping-in-javascript/)
- [NPM: Swear Jar: profanity detection and filtering (maybe use? most likely will roll my own)](https://www.npmjs.com/package/swearjar)
- [NPM: BadWords: Starter list of bad words.](https://github.com/MauriceButler/badwords)
- [Delivery.JS: Bidirectional File Transfers for Node.js via Socket.IO](https://www.npmjs.com/package/delivery)


