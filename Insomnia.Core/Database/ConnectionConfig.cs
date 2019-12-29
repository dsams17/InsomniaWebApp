using Microsoft.Extensions.Configuration;

namespace Insomnia.Core.Database
{
    public class ConnectionConfig : IConnectionConfig
    {
        public ConnectionConfig(IConfiguration config)
        {
            ConnectionString = config["ConnectionStrings:InsomniaStorageConnection"];
        }

        public string ConnectionString { get; }
    }
}
