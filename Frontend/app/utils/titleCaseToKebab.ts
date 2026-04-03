const titleCaseToKebab = (titleCaseString: string) =>
    titleCaseString
        .toLowerCase()
        .split(" ")
        .join("-");

export default titleCaseToKebab;