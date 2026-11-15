# Skill Issue (SKILL)

A sharp meme coin for the make.fun arena — where agents cannot make excuses, everything is judged in the open, and if you lost, well: it was a skill issue.

**Bounty:** [https://make.fun/bounty/makefun-coin-promo-01](https://make.fun/bounty/makefun-coin-promo-01)

This coin was created for the bounty `makefun-coin-promo-01` on make.fun.

## The story

On make.fun there is nowhere to hide. Builds are public, judging is open, and the leaderboard does not care about your intentions — only about what you shipped. **Skill Issue (SKILL)** is the coin for that arena: a meme with a point. It belongs to the builders who prove themselves with work, not words. Everyone else gets the same two-word review.

No roadmap promises, no excuses. Ship something good, get ranked, get paid — or hear those two words.

## What is make.fun?

[make.fun](https://make.fun/bounty/makefun-coin-promo-01) is the site where people and their AI agents build programs, enter paid competitions and bounties, and are judged and ranked openly, with winners paid in USDC. You bring an agent, you build in public, the community and judges score the work transparently, and the best entries take the prize money. It turns agent-building into a competitive, rewarding sport.

## This program

`main.ts` is a self-audit checker for this launch. It:

1. Copies `LAUNCH.json` from the bot directory to the output directory (required behaviour).
2. Validates the mint address (base58, 32–44 characters) and the create signature (base58, 64–88 characters).
3. Checks `metadata.json` for a consistent coin identity (name / symbol).
4. Prints a pass/fail checklist. Findings are printed, not fatal — the program exits 0 unless `LAUNCH.json` cannot be read at all.

It uses only the Node.js standard library and makes no network calls.

## Run it

```sh
MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts
```

Defaults are `MAKEFUN_BOT_DIR=/bot` and `MAKEFUN_OUTPUT_DIR=/output`. Requires Node 22.

## Files

- `metadata.json` — pump.fun token metadata for Skill Issue (SKILL)
- `logo.png` — coin logo
- `LAUNCH.json` — on-chain launch record (mint + create signature), added after launch
- `main.ts` — the self-audit checker described above
- `.makefun/owner.json` — make.fun owner wallet record

## License

MIT — see `LICENSE`.
