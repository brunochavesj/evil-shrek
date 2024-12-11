function scheduleScriptExecution(scriptText, repeatCount, targetHour, targetMinute, timezoneOffset) {
    // Calculate the delay to target time
    const now = new Date();
    const targetTime = new Date();
    targetTime.setUTCHours(targetHour - timezoneOffset, targetMinute, 0, 0);

    // Adjust for the next day if the target time has passed
    if (targetTime < now) {
        targetTime.setUTCDate(targetTime.getUTCDate() + 1);
    }

    const delay = targetTime - now;

    console.log(`Script scheduled to run in ${Math.round(delay / 1000)} seconds`);

    // Schedule the script
    return new Promise(resolve => {
        setTimeout(async () => {
            console.log(`Starting script at ${new Date().toLocaleString()}`);
            for (let i = 0; i < repeatCount; i++) {
                console.log(`Sending iteration ${i + 1}`);
                await enviarScript(scriptText);
                await new Promise(resolve => setTimeout(resolve, 250)); // Pause before the next iteration
            }
            console.log("Script execution completed.");
            resolve(repeatCount);
        }, delay);
    });
}

async function enviarScript(scriptText) {
    const lines = scriptText.split(/[\n\t]+/).map(line => line.trim()).filter(line => line);
    const main = document.querySelector("#main");
    const textarea = main.querySelector(`div[contenteditable="true"]`);
    
    if (!textarea) throw new Error("No conversation is open");

    for (const line of lines) {
        console.log(line);

        textarea.focus();
        document.execCommand('insertText', false, line);
        textarea.dispatchEvent(new Event('change', { bubbles: true }));

        setTimeout(() => {
            (main.querySelector(`[data-testid="send"]`) || main.querySelector(`[data-icon="send"]`)).click();
        }, 100);

        if (lines.indexOf(line) !== lines.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 250));
        }
    }

    return lines.length;
}

// Usage
const scriptText = `
SHREK

Written by

William Steig & Ted Elliott

SHREK
But you ARE beautiful.

They smile at each other.

DONKEY
(chuckles) I was hoping this would be 
a happy ending.

Shrek and Fiona kiss...and the kiss fades into...

THE SWAMP

...their wedding kiss. Shrek and Fiona are now married. 'I'm 
a Believer' by Smashmouth is played in the background. Shrek 
and Fiona break apart and run through the crowd to their awaiting 
carriage. Which is made of a giant onion. Fiona tosses her bouquet 
which both Cinderella and Snow White try to catch. But they end 
up getting into a cat fight and so the dragon catches the bouquet 
instead. The Gingerbread man has been mended somewhat and now 
has one leg and walks with a candy cane cane. Shrek and Fiona 
walk off as the rest of the guests party and Donkey takes over 
singing the song.

GINGERBREAD MAN
God bless us, every one.

DONKEY
(as he's done singing and we fade to 
black) Oh, that's funny. Oh. Oh. I can't 
breathe. I can't breathe.

THE END
`;

const repeatCount = 100; // Number of times to send the script
const targetHour = 3; // Hour in GMT-3
const targetMinute = 0; // Minute
const timezoneOffset = -3; // Timezone offset for GMT-3

scheduleScriptExecution(scriptText, repeatCount, targetHour, targetMinute, timezoneOffset)
    .then(e => console.log(`Código finalizado, ${e} mensagens enviadas`))
    .catch(console.error);
