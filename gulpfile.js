
const gulp = require('gulp');
const spawn = require('child_process').spawn;
const path = require('path')

//-----------------------------------------------------------------
gulp.task('install', () => {
  return npm('--prefix starter-rest-server install');
})

//-----------------------------------------------------------------

gulp.task('build:typescript', () => {
  return npm('--prefix starter-rest-server run build');
});


gulp.task('build:docker', () => {
  return npm('--prefix starter-rest-server run build:docker');
});
gulp.task('build', gulp.series('build:typescript', 'build:docker'));

//-----------------------------------------------------------------

gulp.task('unittest', () => {
  return npm('--prefix starter-rest-server run test');
});

gulp.task('fv', () => {
  return npm('--prefix starter-rest-server run test:fv');
});

//-----------------------------------------------------------------
gulp.task('fabcar:build', gulp.series([
  () => {
    return npm('--prefix demo-zone/fabcarcontract install');
  }, () => {
    return npm('--prefix demo-zone/fabcarcontract run build');
  }
]));

gulp.task('fabcar:install', () => {
  return callSpawn('docker', "exec cli peer chaincode install -n fabcarnetwork -v 1 -p /opt/gopath/src/github.com/fabcarcontract -l node")
});

gulp.task('fabcar:instantiate', () => {
  return callSpawn('docker', 'exec cli peer chaincode instantiate -n fabcarnetwork -v 1 -l node -c \'{"Args":["instantiate"]}\' -C mychannel ')
});

gulp.task('fabcar:deploy', gulp.series('fabcar:build', 'fabcar:install', 'fabcar:instantiate'));

gulp.task('starthlf', () => {
  let p = path.resolve(__dirname, './demo-zone/');
  return callSpawn(path.join(p, 'start.sh'), '', p)
})


//-----------------------------------------------------------------
// Main tasks
// fullfv - builds the same and then 
gulp.task('fullfv', gulp.series(['fabcar:build', 'starthlf', 'fv']))

// The complete Full build, unit, fv  tests
gulp.task('default', gulp.series(['install', 'build', 'unittest', 'fullfv']));



//-----------------------------------------------------------------
function npm(args) {
  return callSpawn('npm', args);
}

/**
 */
function callSpawn(command, args = '', cwd = __dirname) {
  const call = spawn(command, args.split(' '), { env: process.env, shell: true, stdio: "inherit", cwd });
  call.on('exit', function (code) {
    console.log(`${command} exited with code ` + code.toString());
  });

  return call;
}