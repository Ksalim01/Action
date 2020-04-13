const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');
const io = require('@actions/io');
const artifact = require('@actions/artifact');
const fs = require('fs');
const path = require('path');


async function execTests(execPath, reportPath, workDir) {
  let execOptions = {};
  execOptions.cwd = workDir;

  // --gtest_output=xml:report.xml
  await exec.exec(execPath, [`--gtest_output=xml:${reportPath}`], execOptions);
  
  const githubRoot = process.env.GITHUB_WORKSPACE;
  const workDirPath = path.join(githubRoot, workDir);
  
  const artifactClient = artifact.create();
  const artifactName = 'test-report';
  
  const files = [path.join(workDirPath, reportPath)];
  const rootDir = workDirPath;
  const options = {
    continueOnError: false
  };
  console.log(workDirPath);
  
  const uploadResponse = await artifactClient.uploadArtifact(artifactName, files, rootDir, options);
}



try {
  // `who-to-greet` input defined in action metadata file
  const execPath = core.getInput('exec-path');
  const reportPath = core.getInput('report-path');
  const workDir = core.getInput('working-directory');

  execTests(execPath, reportPath, workDir);
  const time = (new Date()).toTimeString();
  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
