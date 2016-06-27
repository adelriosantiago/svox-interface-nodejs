# svox-interface-nodejs

With this Node.js web interface you can generate WAV files directly from the SVOX speech engine.

![](http://adelriosantiago.com/articles/images/tts-final.png)

Demo at: [tts.adelriosantiago.com](http://tts.adelriosantiago.com)

Note that the voice is *not* exactly the most natural voice ever, however SVOX engine pronunciation is far superior than other TTS's out there like Festival or eSpeak.

### Prerequisites

 - UNIX based machine
 - Node
 - The *pico2wave* package

### Installation

 - Clone the project, use the "recaptcha" branch if you want to implement a captcha test every N queries
 - Install the *pico2wave* package
 - Install the *forever* package globally wth `npm install -g forever`
 - (If using the "recaptcha" version) Set the keys for "NOCAPTCHA_SITE" and "NOCAPTCHA_SECRET" from your reCatpcha configuration variable names in a .env file (see .envsample for the sample structure)
 - Run `npm install`
 - Run `npm start`
 - Go to localhost:8999

Tested on:
 - Ubuntu 12.04
 - Ubuntu 12.10

### Troubleshooting

 - forever: not found
 
 Install [forever](https://www.npmjs.com/package/forever) with `npm install -g forever` to ensure that that a given node script runs continuously.

 - Error creating audio file. SVOX is probably not installed.
 
 Install SVOX with `sudo apt-get install libttspico0 libttspico-utils libttspico-data`.
 
 
