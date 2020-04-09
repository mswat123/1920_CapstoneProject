import epson_projector as epson
from epson_projector.const import (POWER)

import asyncio
import aiohttp


async def main():
    """Run main with aiohttp ClientSession."""
    async with aiohttp.ClientSession() as session:
        await run(session)


async def run(websession):
    """Use Projector class of epson module and check if it is turned on."""
    projector = epson.Projector(
        host='HOSTNAME',
        websession=websession,
        port=80,
        encryption=False)
    data = await projector.get_property(POWER)
    print(data)

asyncio.get_event_loop().run_until_complete(main())