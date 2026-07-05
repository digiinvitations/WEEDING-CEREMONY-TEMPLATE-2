const fs = require('fs');
let appTsx = fs.readFileSync('src/App.tsx', 'utf8');

appTsx = appTsx.replace(
  `        </footer>
      </div>

      {/* 13. FLOATING BUTTONS */}`,
  `        </footer>
      </div>
      </div>

      {/* 13. FLOATING BUTTONS */}`
);
fs.writeFileSync('src/App.tsx', appTsx);
