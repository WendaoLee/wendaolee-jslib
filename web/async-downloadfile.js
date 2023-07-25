const axios = require("axios");
const fs = require("fs");


/**
 * 根据https://超链接数组批量下载文件。
 * @param {Array<String>} download_str_arr 下载链接
 * @param {Object} options 可选的参数，用于指定下载文件的一些配置项
 * @param {Function} options.split 保存文件名。默认通过对url的'/'进行分割获取文件名。
 * @param {String} options.save_root 保存文件夹。默认为'./resources'  
 */
export async function downloadFileFromStringArr(download_str_arr,options = {
    split:(download_str) => download_str.split('/')[
        download_str.split('/').length - 1
    ],
    save_root:"./resources/"
}) {
    fs.existsSync('./resources')?null:fs.mkdirSync('./resources')

    for (const download_str of download_str_arr) {
      try {
        const responses = await axios
          .get(download_str, {
            responseType: "arraybuffer",
          })
          .catch((error) => {
            console.error(error);
            throw error;
          });

        const file_path = options.split(download_str)
  
        const dataArray = new Uint8Array(responses.data);
  
        fs.writeFileSync(`${options.save_root}${file_path}`, dataArray);
      } catch (error) {
        console.error("Error occurs:", error);
        console.log("error-str:", download_str);
        error_list.push(download_str);
      }
    }
    fs.writeFileSync("./error_list.txt", JSON.stringify(error_list));
  }