# discord-bot

**discord-bot** is a framework to build bots for DiscordApp built on [discord.js](https://github.com/hydrabolt/discord.js/). It has been made in a modular way, so you can add your own stuff at each level of the stack.



Here is an hello world using **discord-bot** :

```js
var Bot = require('discord-bot');

var bot = new Bot({
	email: <email>,
	password: <pass>
});

bot
	.on(bot.triggers.command, 'hello')
	.do(function(bot, conf, args) {
		this.reply('world');
	});

bot.connect();
```

A bot It is built using 3 types of components :

* The **triggers** are what the bot reacts to, matching a message content for example.
* The **tasks** are what the bot does when a trigger gets executed, like posting a message
* The **services** are shared singletons that are registered to the bot, allowing triggers and task to use them.

## Bot

### Properties

`client`

The DiscordApp client (discord.js), for documentation, refer to [discord.js docs](http://discordjs.readthedocs.org/en/latest/).

### Methods

`connect(callback)`

Connects the bot to discord. `callback` is called when the bot is ready.

`on(trigger, [trigger arguments...])`

Returns the `trigger` you just added.

Add a trigger to the bot and return it so it can be further configured.

`addService(serviceName, Service)`

Add a service to the bot (see below for details);

`hasService(serviceName)`

Is there a service registered under this name ?

`getService(serviceName)`

Get the service registered under this name or `undefined` if not found

## Triggers

These are the things your bot reacts to. Here are the ones that are built-in :

### Now

This is the most basic command, it executes once when the bot is connected.

`bot.on(bot.triggers.now)`

#### Methods

`do(callback)`

Attach a task for this trigger, ie the callback that will be executed when it is triggered. The arguments passed to the callback are:

*  the instance of BotMaker this trigger have been attached to
*  this trigger
*  arguments (trigger dependant) if any

`forEach(array)`

Each time the trigger is executed, it will call its task for each given item, the item is then available in the helper inside the task as `forEachItem` :

```js
bot
	.on(bot.triggers.now)
	.forEach([1, 2, 3])
	.do(function(bot, conf, args) { /* <- this is the task */
		console.log(this.forEachItem);
	});

/* ->
1
2
3
*/
```

`forEachServer()`

Same as `forEach`, for all the servers this bot has access to.

`forEachUser()`

Same as `forEachServer`, for users.

`addHelper(helperName, helperFactory)`

Adds a helper, that will then be available in the task as `this.<helperName>`. The factory will be called with :

*  the instance of BotMaker
*  arguments (trigger dependant) if any
* a callback that should be called with the actual helper

Here is a simplified version of the store helper as an example :
```js
trigger.addHelper('store', function(bot, args, done) {
	userStore.get(args.message.author, function(data) {
		done(data);
	});
})
.do(function(bot, conf, args) {
	this.store // will contain the data fetched above
});
```

### React

Extends Now.

Is executed when a bot sees a message that match given pattern :

`bot.on(bot.triggers.react, /hey|hello/)`

The message that triggered the bot will be available in the `args` params of your task :

```js
bot
	.on(bot.triggers.react, /hey|hello/)
	.do(function(bot, conf, args) { /* <- this is the task */
		console.log(args.message);
	});
```

#### Methods

`withStore()`

Enables the store helper for this trigger. The store service needs to be setup (see below)

```js
restrict({
	/* at least one of */
	serverId: serverId or array of serverIds,
	channelId: channelId or array of channelIds,
	userId: userId or array of userIds
})
```

This trigger will only be executed if the message that triggered it matches the rules above. Ie come from a server listed above.


#### Available helpers

`reply(string)` reply to the original message

`store` if enabled (see above)

### Command

Extends React.

Is executed when the specified command in entered. A command is a message that starts with a `!` then the command keyword. ie: `!hello`.

`bot.on(bot.triggers.command, 'hello', [argumentNames])`

#### Argument parsing

```js
bot
	.on(bot.triggers.command, 'say', ['word'])
	.do(function(bot, conf, args) {
		this.reply(args.commandArgs.word);
	});

//-> !say hello
//<- hello
```

Arguments are separated by spaces and multi words arguments can be double-quoted. Quotes can be escaped ie :

* `argument`
* `"i contain spaces"`
* `"He said \"hello\""`

If no `[argumentNames]` is given, `args.commandArgs` will be an array.
`[argumentNames]` can contain mentions, ex ['word', '@user'].

#### Methods

`describe(description)`

Set a description for this trigger, allowing for example the help package to read it and expose it as a `!help` command. Description can be either a string or `{usage: string, description: string}`

### MentionCommand

Extends Command.

Is executed when someone mentions the bot along with a command keyword, ie `@bot print-help`.
Users can talk to the bot via private message. If so the mention is not nescessary.

```js
bot
	.on(bot.triggers['mention-command'], 'say', ['word'])
	.do(function(bot, conf, args) {
		this.reply(args.commandArgs.word);
	});

//-> @bot say hello
//<- hello
```

### Cron

Extends Now.

Is executed each time the given cron expression ticks.

```js
bot
	.on(bot.triggers.cron, '* * * * *')
	.do(function(bot, conf, args) {
		// do stuff
	});

// will be executed every minute
```

See [here](http://www.nncron.ru/help/EN/working/cron-format.htm) for more details on cron syntax.

### Create your own trigger

You can easily create your own trigger by extending an existing one, Now being the simplest.
Typically you will override the `run(bot)` method to control when the trigger is executed.

Here is React implementation on `run` as an example :

```js
React.prototype.run = function(bot) {
	var that = this;

	bot.client.on('message', function(message) {
		if (!message.content.match(that.pattern))
			return;

		that.execute(bot, { message: message });
	});
};
```

It can then be attached to the bot like any other :

```js
var myTrigger = require('./my-trigger');

// bot initialisation

bot.on(myTrigger, firstTriggerContructorArgument, secondTriggerContructorArgument...)
```

## Services

Services are registered to the bot via `bot.addService(name, service)`. Once registered, they can be accessed everywhere the `bot` instance is available via `bot.getService(name)`.

### Help

This component is used by Command triggers to register their synopses so a help Command can print the list of available commands.

`bot.addService('help', bot.services.help);`

#### Methods

`add(synopsis)`

`get()` returns all the registered synopses

### Store

The stores services are a convenient way to store and retrieve data about Discord users.

They provides these methods :

`get(User, callback)`

Retrieve data about a given User object (from discord.js) and `callback(data)`. If no data if found on the storage layer, an object like `{ id: userId }` will be passed to the callback.

`set(User, data, callback)`

Save data for a User.

`getAndUpdate(User, callback)`

  Same as get, but adds a `done()` callback as a second parameter so the data can be saved back when modifications are done :

```js
store.getAndUpdate(user, function(data, done) {
	data.someCounter++;
	done();
});
```

#### MongoDb

MongoDb backed store.

```js
bot.addService('store', bot.services['mongo-store']('mongodb://localhost/discord'));
```
