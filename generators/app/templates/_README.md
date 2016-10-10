# <%= name %>

AWS Lambda function.

## Build

Build a new function version, and publish on AWS Lambda

```bash
grunt deploy
```

## Development

Run Lambda function locally, simulating a real call. Uses `event.json` as event source.

```bash
grunt run
```

This task sets two environment variables for the simulated run:

- The IAM role used by the real Lambda funcion, *<%= role %>*
- A local IAM user profile with permission to assume the role, *<%= profile %>*

The IAM keys for this profile must be configured in `~/.aws/credentials`

## References

Uses [grunt-aws-lambda](https://github.com/Tim-B/grunt-aws-lambda) tool for
package and deploy in AWS Lambda.
