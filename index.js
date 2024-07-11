function doGet() {
    var template = 'index';
    return HtmlService
        .createTemplateFromFile('index')
        .evaluate()
        .addMetaTag('viewport', 'width=device-width, initial-scale=1')  //html側にメタタグを設定しても意味がなかったためこちらで設定
}
function doPost(e) {
    SendToNotion(e.parameter.title, e.parameter.subtitle, e.parameter.authors, e.parameter.publishedDate,
        Number(e.parameter.pageCount), e.parameter.isbn, e.parameter.imageSrc);
}

// Notion API
function SendToNotion(title, subtitle, authors, publishedDate, pageCount, isbn, imageSrc) {
    const notion_key = 'secret_lruJvyFNd3aRm8HD5qmZX5JfKeqQdYaGCTxb5lP1z4E';
    const database_id = '2517262d6cc0429797696292c1e83583';

    json_data = {
        'parent': { 'database_id': database_id },
        'properties': {
            //プロパティを記述する
            'Title': {
                'title': [
                    {
                        'text': {
                            'content': title,
                        }
                    }
                ]
            },
            'Subtitle': {
                'rich_text': [
                    {
                        'text': {
                            'content': subtitle,
                        }
                    }
                ]
            },
            'Author': {
                'rich_text': [
                    {
                        'text': {
                            'content': authors,
                        }
                    }
                ]
            },
            'State': {
                'select': {
                    'name': '興味あり',
                    'color': 'yellow'
                }
            },
            'PublishedDate': {
                'rich_text': [
                    {
                        'text': {
                            'content': publishedDate,
                        }
                    }
                ]
            },
            'PageCount': {
                'number': pageCount
            },
            'Cover': {   //本文からプロパティに移行
                "type": "files",
                "files": [
                    {
                        "name": "Cover",
                        "type": "external",
                        "external": {
                            "url": imageSrc
                        }
                    }
                ]
            },
            'ISBN': {
                'rich_text': [
                    {
                        'text': {
                            'content': isbn,
                        }
                    }
                ]
            }
        }
        //ここから本文だが、今回は使わない
        // 'children': [
        // ]
    };

    const response = UrlFetchApp.fetch('https://www.notion.so/2517262d6cc0429797696292c1e83583?pvs=4', {
        "method": "post",
        "headers": {
            'Content-Type': 'application/json; charset=UTF-8',
            'Authorization': 'Bearer ' + notion_key,
            'Notion-Version': '2021-05-13',
        },
        "payload": JSON.stringify(json_data),
        'muteHttpExceptions': true
    });
}