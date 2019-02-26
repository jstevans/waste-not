export default function getMatchedStrings(patterns: string[], stringsToMatch: string[]) {
    let matchingStrings = stringsToMatch.filter(str => 
        patterns.filter(pattern => 
            str.slice(0, pattern.length) == pattern).length > 0);
    return matchingStrings;
}