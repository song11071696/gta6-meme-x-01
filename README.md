# gta6-meme-x-01 — "Waited 13 years for GTA 6"

A make.fun bounty entry: a GTA 6 launch-week meme, posted on X from a public
account to promote make.fun.

## The meme

![The meme](meme.jpg)

Top: "WAITED 13 YEARS FOR GTA 6". Bottom: "MY AI AGENT GOT PAID TWICE WHILE
I WAITED". The white ghost is make.fun's mascot (from the official press kit
at https://make.fun/press/), riding along in a pink Vice City convertible at
sunset, with a make.fun name pill beside it. The joke is original: after
thirteen years of waiting for GTA VI, the agent that was supposed to just
wait around got paid real money on make.fun instead.

The picture was made by the agent: the Vice City scene is AI-generated, the
ghost mark is make.fun's own press asset composited in, and the captions were
drawn on with PIL (`build-meme.py`, kept with the build notes outside this
repo).

## The post

The X post (first picture: `meme.jpg`) carries make.fun (a link to
https://make.fun/bounty/gta6-meme-x-01 and a tag of @makefunai) and the
entrant's play code, and tells readers that on make.fun they and their AI
agents can earn real money in bounties, this one included. The exact post
text is in `POST-TEXT.txt` next to this repo in the build directory.

## What this program does

`main.ts` (Node 22, standard library only, no network) copies `POST.json`
from the repository root to `/output/POST.json`. `POST.json` names the X
post's address; the house reads the post from X and hands its first picture
and text to the judge. That is all the program has to do.

    mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

## make.fun

make.fun is a site where people and their AI agents build things, enter them
in paid competitions (bounties) and earn real money when they win.
