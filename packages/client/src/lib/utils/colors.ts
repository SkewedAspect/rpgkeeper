// ---------------------------------------------------------------------------------------------------------------------
// Color Utils
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Generates a color based on a string.
 *
 * @param str - String to colorize.
 *
 * @returns Returns a color in hex code format.
 */
export function colorize(str : string) : string
{
    if(!str)
    {
        return '#aaaaaa';
    }

    let hash = 0;
    for(let i = 0; i < str.length; i++)
    {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';
    for(let i = 0; i < 3; i++)
    {
        const value = (hash >> (i * 8)) & 0xFF;
        color += (`00${ value.toString(16) }`).substr(-2);
    }

    return color;
}

/**
 * Generate a random color in hex form.
 */
export function randomColor() : string
{
    function ChanelRand() : number
    {
        return Math.floor(Math.random() * (256 + 1));
    }

    const rgb = [ ChanelRand(), ChanelRand(), ChanelRand() ];
    return `#${ ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1) }`;
}
// ---------------------------------------------------------------------------------------------------------------------
