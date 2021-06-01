/**
 * Safe combine between two objects.
 * if both objects has the same property an error is occurs!
 * @returns the combined object
 */
function safeCombine( objA, objB ) {
    const objAKeys = Object.keys( objA );
    const objBKeys = Object.keys( objB );

    const isDuplicated = !objAKeys.every( key => !objBKeys.includes( key ));
    if (isDuplicated) {
        throw new Error('Duplicated keys detected!');
    }

    return { ...objA, ...objB };
}

module.exports = safeCombine;
