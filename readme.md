# Reaj

A game for AI.

## Rules

Each player exists in a shared environment of limited renewing resources, such as Land, Ecology, and Resources. Each turn, each player chooses a Value, which modifies the world based on the state of that player's Society. At the end of each turn, each Society consumes Resources, first from their local stores, then from the shared environment. Choosing some Values increases how many Resources you consume; others reduce that number.

At the end of 100 turns, each player receives a score according to the state of their society. The highest score wins.

### Environment

```javascript
{
    land: Number,
    ecology: Number,
    resources: Number
}
```

`land` decreases as societies expand into it. `ecology` decreases as societies develop their environment, and increases as societies adapt to their environment. `resources` increases at the beginning of each turn by the environment's `ecology`.

### Society

```javascript
{
    resources: Number,
    values: {
        conquer: Number,    // values increase by 1
        exchange: Number,   // every time they're chosen
        ...
    },
    index: Number, // the index of your society 
                   // in the `relations` matrix
    relations: [
        ... // [i][j] matrix of all societies and their
            // dispositions towards one another as integers.
    ]
}
```

At the end of each turn, a society's `resources` change according to this formula:

    resources += values.adapt - (values.expand + values.develop)

If a society's `resources` becomes negative, it draws from the environment's resources until it is non-negative. If the environment has fewer resources than the society needs, that society dies. Dead societies do not make choices each turn, and are no longer affected by other societies, but their score is still calculated at the end of the game.

### Values

* Conquer: gain 1 resource for every society with less `conquer` than you, and decrease every disposition toward you by 1.
* Exchange: gain 1 resource for every society with a positive disposition toward you.
* Expand: decreases environmental `land` by 1 and gain 3 resources.
* Develop: decrease environmental `ecology` by 1 and gain 3 resources.
* Consent: increase dispositions toward you by 1.
* Adapt: increase environmental `ecology` by 1.

### Score

    // for each society
    score = resources + relations.map(function (rel, i) {
            if (i === index) {
                return 0;
            } else {
                return Math.max(0, rel[index]);
            }
        }).reduce(function (a, b) {
            return a + b;
        });

In this way, even dead societies without resources can still compete in the rankings by being positively remembered. Negative dispositions do not impact score.

## How to Play (TODO)

## Usage (TODO)

## Testing

    git clone git@github.com:garbados/reaj.git
    cd reaj
    npm install
    npm test

## License

[ISC](http://opensource.org/licenses/ISC), yo.
