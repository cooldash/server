import { bot } from '../bot';
import { reactions } from './reactions';
import { commands } from './commands';
import { runScenario } from './run-scenario';


bot.on('command', ctx => {
  if (commands[ctx.command]) {
    return commands[ctx.command](ctx);
  } else {
    return commands.notFound(ctx);
  }
});

bot.on('message', ctx => {
  const words = ctx.message.text.split(' ');

  if (ctx.session.scenario) {
    return runScenario(ctx.session.scenario, ctx);
  }

  let foundWord;

  for (let i = 0; i < reactions.length; i++) {
    const reaction = reactions[i];

    foundWord = words
      .find(word => {
        return reaction.words.includes(word.toLowerCase());
      });

    if (foundWord) {
      console.log('word found', foundWord, 'for reaction', reaction.words);
      reaction.reaction(ctx, foundWord);
      break;
    }
  }

  if (!foundWord) {
    return commands.notFound(ctx);
  }
});

bot.on('voice', ctx => {
  const voice = atob(ctx.voice);

});
