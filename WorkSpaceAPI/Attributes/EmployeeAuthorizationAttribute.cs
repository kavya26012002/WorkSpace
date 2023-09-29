using Microsoft.AspNetCore.Mvc;

namespace WorkSpaceAPI.Attributes
{
    public class EmployeeAuthorizationAttribute : TypeFilterAttribute
    {
        public EmployeeAuthorizationAttribute() : base(typeof(EmployeeAuthorizationFilter))
        {
            Arguments = new object[] { };
        }
    }

}
