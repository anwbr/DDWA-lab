module.exports = {
    plugins: [
        require('postcss-smart-import')({}),
        require('autoprefixer')({
            cascade: false,
            browsers: ['last 2 versions', '> 1%']
        })
    ]
}