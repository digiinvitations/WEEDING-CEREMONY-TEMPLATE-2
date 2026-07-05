const fs = require('fs');

let appTsx = fs.readFileSync('src/App.tsx', 'utf8');

const search = `        {allHeartsScratched && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="text-center relative z-10 mb-8 mt-[-2rem]">
              <Countdown targetDate={config.weddingDate} />
            </div>`;

const replace = `        {allHeartsScratched && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <div className="text-center relative z-10 mb-8 mt-[-2rem]">
              <Countdown targetDate={config.weddingDate} />
            </div>
          </motion.div>
        )}`;

appTsx = appTsx.replace(search, replace);

appTsx = appTsx.replace(
  `        </footer>
          </motion.div>
        )}
      </div>`,
  `        </footer>
      </div>`
);

fs.writeFileSync('src/App.tsx', appTsx);
console.log("Fixed allHeartsScratched");
