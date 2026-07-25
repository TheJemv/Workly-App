const { withDangerousMod } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

const withCustomPodfile = (config) => {
    return withDangerousMod(config, [
        'ios',
        async (config) => {
            const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile');
            let podfileContent = fs.readFileSync(podfilePath, 'utf8');

            // Verificamos si ya tiene el parche para no duplicarlo
            if (!podfileContent.includes("CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES")) {
                const patch = `
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'
    end
  end
        `;

                // Inyectamos el código justo dentro del bloque post_install existente
                if (podfileContent.includes('post_install do |installer|')) {
                    podfileContent = podfileContent.replace(
                        'post_install do |installer|',
                        `post_install do |installer|${patch}`
                    );
                } else {
                    // Si no existe, lo agregamos al final
                    podfileContent += `\npost_install do |installer|${patch}\nend\n`;
                }

                fs.writeFileSync(podfilePath, podfileContent, 'utf8');
            }

            return config;
        },
    ]);
};

export default withCustomPodfile;