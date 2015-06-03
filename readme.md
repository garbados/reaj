# Reaj

[![Build Status](https://travis-ci.org/garbados/reaj.svg?branch=master)](https://travis-ci.org/garbados/reaj)
[![Coverage Status](https://coveralls.io/repos/garbados/reaj/badge.svg)](https://coveralls.io/r/garbados/reaj)

A game for AI.

## Rules

Each player directs a society in a shared environment of limited renewing resources, such as land, ecology, and resources. Each turn, given only the state of the environment, their own society, and the relations between all societies, each player chooses an action, which modifies the environment based on the state of that player's society and the choices of the other players. At the end of each turn, each society consumes resources; if they lack sufficient resources, they die. Some choices increase how many resources you consume; others reduce that number.

Players win if their society survives 100 turns. 

(In this way, strategies can be profiled based not only on whether their society survives, but also on how they affect the survival of other societies.)

### Environment

```javascript
{
    land: Number,
    ecology: Number,
    resources: Number
}
```

`land` decreases as societies expand into it. `ecology` decreases as societies develop their environment, and increases as societies adapt to their environment. `resources` increases at the beginning of each turn by the environment's `ecology`, but returns to 0 when players choose to exchange the fruits of their environment.

### Society

```javascript
{
    resources: Number,
    values: {
        conquer: Number,    // values start at 0
        exchange: Number,   // and increase by 1
        expand: Number,     // every time they're chosen
    },
    index: Number, // the index of your society 
                   // in the `relations` matrix
}
```

At the end of each turn, a society's `resources` change according to this formula:

    resources += values.adapt - (values.expand + values.develop)

If a society's resources go negative, that society dies. Dead societies do not make choices each turn, and are no longer affected by the consequences of any choices.

### Relations

```javascript
// a relations matrix for 5 players
[
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
]
```

Relations between societies are represented as a 2-dimensional square matrix, where society N's dispositions toward other societies are contained in row N, while column N indicates how other societies feel about it.

Each player is given the index of their society, and knows by the size of the matrix the number of other players.

### Choices

* Conquer: gain 1 resource for every society with less `conquer` than you, while they lose 1 resource. Decrease every disposition toward you by 1. (minority game)
* Exchange: gain X resources, where X is the environment's resources divided by the number of players that chose to exchange this turn. Sets the environment's resources to 0. (centipede game)
* Expand: decrease the environment's land by X, where X is the number of societies who chose to expand this turn. Then, gain Y resources, where Y is the environment's remaining land. (discoordination game)
* Develop: decrease the environment's ecology by X, where X is the number of societies who chose to develop this turn. Then, gain Y resources, where Y is the number of times your society has chosen to develop. If the environment's ecology is less than 0, all societies lose N resources, where N is the number of players. (discoordination game, tragedy of the commons)
* Cooperate: increase all dispositions toward you by 1, then gain X resources, where X is the number of societies that chose to cooperate this turn. If X is 0, all societies lose N resources, where N is the number of players. (volunteer's dilemma and coordination game)
* Adapt: increase environmental `ecology` by 1. (turtle, volunteer's dilemma)

## How to Play (TODO)

## Usage (TODO)

## Testing

    git clone git@github.com:garbados/reaj.git
    cd reaj
    npm install
    npm test

## License

[ISC](http://opensource.org/licenses/ISC), yo.
