const readChunk = require('read-chunk');
const fileType = require('file-type');

module.exports.create = (req, res, next) => {

}

module.exports.uploadResource = (req, res, next) => {
    let classDest = path.join(__dirname, "../../public/classes", id);
    if (!fs.existsSync(classDest)) {
        res.error = {
            status: 400,
            msg: "Bad class ID"
        };
        return next(new Error(res.error));
    }
    const buffer = readChunk.sync(req.file.path, 0, 4100);
    let type = fileType(buffer).ext;
    //TODO: check if type in a list of known good, otherwise del
    let name = fs.readdirSync(classDest).length.toString();
    fs.rename(req.file.path, path.join(classDest, name + '.' + type), function (err) {
        if (err) console.log(err);
    });
}

module.exports.read = () => {

}

module.exports.update = () => {

}

module.exports.destroy = () => {

}