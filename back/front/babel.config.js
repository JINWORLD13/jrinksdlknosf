export default {
  presets: [
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: [
    function () {
      return {
        visitor: {
          MemberExpression(path) {
            // Check if this is import.meta.env
            if (
              path.node.object &&
              path.node.object.type === 'MetaProperty' &&
              path.node.object.meta &&
              path.node.object.meta.name === 'import' &&
              path.node.object.property &&
              path.node.object.property.name === 'meta' &&
              path.node.property &&
              path.node.property.name === 'env'
            ) {
              // Replace entire import.meta.env with process.env
              path.replaceWithSourceString('process.env');
            }
          },
        },
      };
    },
  ],
};
