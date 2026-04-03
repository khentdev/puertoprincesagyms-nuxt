const kebabToTitleCase = (kebabString: string) =>
    kebabString
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");


export default kebabToTitleCase;