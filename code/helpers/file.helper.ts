// ********************************************************************************************************************
// function:    fileExists
// ********************************************************************************************************************
// parameters:  url - the url
// ********************************************************************************************************************
// returns:     whether the file exists
// ********************************************************************************************************************
export function fileExists(url: string): boolean {

    var http = new XMLHttpRequest();

    http.open('HEAD', url);

    http.send();

    return http.status != 404;
}

// ********************************************************************************************************************
// function:    fileLoad
// ********************************************************************************************************************
// parameters:  url - the url
// ********************************************************************************************************************
// returns:     the content
// ********************************************************************************************************************
export function fileLoad(url: string): Promise<Blob> {

    return new Promise<Blob>(result => {

        fetch(url).then(response => {

            response.blob().then(blob => {

                result(blob);
            })
        })
    })
}