using Recycling_Kiosk.Modules;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Web.Http;

namespace Recycling_Kiosk.Controllers
{
    public class ValuesController : ApiController
    {
        [BasicAuthentication]
        [Route("api/values/test")]
        [HttpGet]
        public IEnumerable<string> Values()
        {
            return new string[] { "value1", "value2" };
        }

        [Route("api/version")]
        [HttpGet]
        public string Version()
        {
            Assembly asm = Assembly.GetExecutingAssembly();
            FileVersionInfo versionInfo = FileVersionInfo.GetVersionInfo(asm.Location);
            return string.Format("{0}.{1}.{2}.{3}", versionInfo.FileMajorPart, versionInfo.FileMinorPart, versionInfo.FileBuildPart, versionInfo.FilePrivatePart);
        }
    }
}
