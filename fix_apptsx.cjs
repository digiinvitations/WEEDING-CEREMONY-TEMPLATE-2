const fs = require('fs');

let appTsx = fs.readFileSync('src/App.tsx', 'utf8');

const badStart = `        <SectionSeparator /> </div>
                    </div>

                    <div className={\`flex flex-col items-center \${isEven ? 'md:items-start' : 'md:items-end'}\`}>`;

const badEndStr = `          </div>
        </section>

        <SectionSeparator />`;

const startIndex = appTsx.indexOf(badStart);
const endIndex = appTsx.indexOf(badEndStr, startIndex);

if (startIndex !== -1 && endIndex !== -1) {
  appTsx = appTsx.slice(0, startIndex) + appTsx.slice(endIndex + badEndStr.length);
  // Restore the separator that was supposed to be there at the end of the carousel
  appTsx = appTsx.replace(
    '        </section>\n\n        {/* 12. THANK YOU SECTION */}',
    '        </section>\n\n        <SectionSeparator />\n\n        {/* 12. THANK YOU SECTION */}'
  );
  
  fs.writeFileSync('src/App.tsx', appTsx);
  console.log("Fixed App.tsx duplicate block");
} else {
  console.log("Could not find the duplicate block to remove");
}
