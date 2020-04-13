const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');
const io = require('@actions/io');
const artifact = require('@actions/artifact');


try {
  // `who-to-greet` input defined in action metadata file
  const execPath = core.getInput('exec-path');
  const reportPath = core.getInput('report-path');

  // --gtest_output=xml:report.xml
  await exec.exec(execPath, [`--gtest_output=xml:${reportPath}`]);

  const artifactClient = artifact.create();
  const artifactName = 'test-report';
  const files = [reportPath];
  const rootDir = '.';
  const options = {
    continueOnError: false
  };
  const uploadResponse = await artifactClient.uploadArtifact(artifactName, files, rootDir, options);

  core.setOutput("time", time);
  // Get the JSON webhook payload for the event that triggered the workflow
  const payload = JSON.stringify(github.context.payload, undefined, 2)
  console.log(`The event payload: ${payload}`);
} catch (error) {
  core.setFailed(error.message);
}
